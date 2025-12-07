"""
Six Degrees of Kevin Bacon Network Generator

Generates a larger CSV dataset exploring the "Six Degrees of Kevin Bacon" concept.
Uses radius=3 to capture more connections:
- Kevin Bacon → his movies → co-stars → their movies → co-stars of co-stars

This creates a richer network that better demonstrates the "small world" phenomenon.

Outputs:
- six_degrees_edges.csv: Edge list (Source,Target)
- six_degrees_nodes.csv: Node metadata (id,category,year,rating,genre,certification,movies,degree)
"""

import pandas as pd
import networkx as nx
import ast
import os

def parse_list_field(value):
    """Safely parse a string representation of a list."""
    try:
        result = ast.literal_eval(value)
        if isinstance(result, list):
            return result
        return []
    except (ValueError, SyntaxError, TypeError):
        return []

def clean_genre(genre_list):
    """Clean and format genre list as comma-separated string."""
    if not genre_list:
        return ""
    return ", ".join(g.strip() for g in genre_list)

def main():
    # Load movie data
    print("Loading movie data...")
    movies = pd.read_csv('data.csv')
    print(f"Loaded {len(movies)} movies")

    # Build bipartite graph with metadata
    print("Building graph with metadata...")
    G = nx.Graph()

    # Store movie metadata for later
    movie_metadata = {}

    for _, movie in movies.iterrows():
        title = movie['Movie Name']
        stars = parse_list_field(movie['Stars'])

        if not stars:
            continue

        # Store movie metadata
        year = movie['Year of Release'] if pd.notna(movie['Year of Release']) else None
        rating = movie['Movie Rating'] if pd.notna(movie['Movie Rating']) else None
        genre = clean_genre(parse_list_field(movie['Genre']))
        certification = movie['Certification'] if pd.notna(movie['Certification']) else ""

        movie_metadata[title] = {
            'year': int(year) if year else None,
            'rating': round(float(rating), 1) if rating else None,
            'genre': genre,
            'certification': certification
        }

        G.add_node(title, kind="movie")
        for star in stars:
            G.add_node(star, kind="actor")
            G.add_edge(title, star)

    actor_count = sum(1 for n, d in G.nodes(data=True) if d.get('kind') == 'actor')
    movie_count = sum(1 for n, d in G.nodes(data=True) if d.get('kind') == 'movie')
    print(f"Full graph: {movie_count} movies, {actor_count} actors, {len(G.edges())} edges")

    # Check if Kevin Bacon exists
    if 'Kevin Bacon' not in G:
        print("ERROR: Kevin Bacon not found in dataset!")
        return

    # Extract Kevin Bacon's ego graph with RADIUS=4 for deeper exploration
    # In a bipartite graph (actors <-> movies):
    # Radius 2: Kevin + his movies + co-stars
    # Radius 4: + their movies + co-stars of co-stars (2 degrees of separation)
    # Radius 6: would give 3 degrees of separation
    RADIUS = 4
    print(f"Extracting Kevin Bacon's ego graph (radius={RADIUS})...")
    subG = nx.ego_graph(G, 'Kevin Bacon', radius=RADIUS, center=True)

    sub_actors = sum(1 for n, d in subG.nodes(data=True) if d.get('kind') == 'actor')
    sub_movies = sum(1 for n, d in subG.nodes(data=True) if d.get('kind') == 'movie')
    print(f"Ego graph: {sub_movies} movies, {sub_actors} actors, {len(subG.edges())} edges")

    # Calculate degrees of separation from Kevin Bacon for each node
    print("Calculating degrees of separation...")
    distances = nx.single_source_shortest_path_length(subG, 'Kevin Bacon')

    # Prepare output directory
    output_dir = '../graph-js-demos/public/data'
    os.makedirs(output_dir, exist_ok=True)

    # Generate edges CSV
    edges_path = f'{output_dir}/six_degrees_edges.csv'
    edges = [(u, v) for u, v in subG.edges()]
    edges_df = pd.DataFrame(edges, columns=['Source', 'Target'])
    edges_df.to_csv(edges_path, index=False)
    print(f"Generated edges: {edges_path}")

    # Generate nodes CSV with metadata
    nodes_path = f'{output_dir}/six_degrees_nodes.csv'
    nodes_data = []

    for node_id in subG.nodes():
        node_attrs = G.nodes[node_id]
        kind = node_attrs.get('kind', 'unknown')

        # Get distance from Kevin Bacon (degree of separation)
        # For actors: distance / 2 (since path goes through movies)
        # For movies: (distance - 1) / 2 + 0.5 (in between actors)
        raw_distance = distances.get(node_id, 0)
        if kind == 'actor':
            degree_of_separation = raw_distance // 2
        else:
            degree_of_separation = raw_distance  # Keep as hop count for movies

        if kind == 'movie':
            meta = movie_metadata.get(node_id, {})
            nodes_data.append({
                'id': node_id,
                'category': 'movie',
                'year': meta.get('year', ''),
                'rating': meta.get('rating', ''),
                'genre': meta.get('genre', ''),
                'certification': meta.get('certification', ''),
                'movies': '',
                'degree': degree_of_separation  # Hops from Kevin Bacon
            })
        else:  # actor
            # Count movies in subgraph
            actor_movies = [n for n in subG.neighbors(node_id)
                          if G.nodes[n].get('kind') == 'movie']
            nodes_data.append({
                'id': node_id,
                'category': 'actor',
                'year': '',
                'rating': '',
                'genre': '',
                'certification': '',
                'movies': len(actor_movies),
                'degree': degree_of_separation  # Degrees from Kevin Bacon
            })

    nodes_df = pd.DataFrame(nodes_data)
    nodes_df.to_csv(nodes_path, index=False)
    print(f"Generated nodes: {nodes_path}")

    # Summary statistics
    print(f"\n{'='*50}")
    print(f"SIX DEGREES OF KEVIN BACON - NETWORK SUMMARY")
    print(f"{'='*50}")
    print(f"Total Nodes: {len(subG.nodes())} ({sub_movies} movies, {sub_actors} actors)")
    print(f"Total Edges: {len(subG.edges())}")
    print(f"Radius: {RADIUS}")

    # Degree distribution
    print(f"\nDegrees of Separation Distribution (Actors):")
    actor_degrees = [n['degree'] for n in nodes_data if n['category'] == 'actor']
    for deg in sorted(set(actor_degrees)):
        count = actor_degrees.count(deg)
        pct = 100 * count / len(actor_degrees)
        bar = '█' * int(pct / 2)
        print(f"  {deg} degree(s): {count:4d} actors ({pct:5.1f}%) {bar}")

    # Sample notable actors by degree
    print(f"\nSample Actors by Degree:")
    for deg in sorted(set(actor_degrees)):
        actors_at_deg = [n['id'] for n in nodes_data
                        if n['category'] == 'actor' and n['degree'] == deg][:3]
        print(f"  {deg} degree(s): {', '.join(actors_at_deg)}")

    # Sample movies
    print(f"\nSample Movies in Network:")
    movie_nodes = [n for n in nodes_data if n['category'] == 'movie'][:5]
    for m in movie_nodes:
        print(f"  - {m['id']} ({m['year']}) - {m['rating']}★ - {m['genre'][:30]}...")

if __name__ == '__main__':
    main()
