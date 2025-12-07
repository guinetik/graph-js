"""
Kevin Bacon Network Generator

Generates CSV datasets for the "Six Degrees of Kevin Bacon" network.
Uses the movie dataset to build a bipartite graph (actors <-> movies)
and extracts Kevin Bacon's ego graph at radius 2.

Outputs two files:
- kevin_bacon_edges.csv: Edge list (Source,Target)
- kevin_bacon_nodes.csv: Node metadata (id,type,year,rating,genre,certification)
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
    # Remove leading spaces and join
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
            continue  # Skip movies with no stars

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

        # Add movie node
        G.add_node(title, kind="movie")

        # Add actor nodes and edges
        for star in stars:
            G.add_node(star, kind="actor")
            G.add_edge(title, star)

    actor_count = sum(1 for n, d in G.nodes(data=True) if d.get('kind') == 'actor')
    movie_count = sum(1 for n, d in G.nodes(data=True) if d.get('kind') == 'movie')
    print(f"Full graph: {movie_count} movies, {actor_count} actors, {len(G.edges())} edges")

    # Check if Kevin Bacon exists in the dataset
    if 'Kevin Bacon' not in G:
        print("ERROR: Kevin Bacon not found in dataset!")
        return

    # Extract Kevin Bacon's ego graph (radius=2)
    print("Extracting Kevin Bacon's ego graph (radius=2)...")
    subG = nx.ego_graph(G, 'Kevin Bacon', radius=2, center=True)

    sub_actors = sum(1 for n, d in subG.nodes(data=True) if d.get('kind') == 'actor')
    sub_movies = sum(1 for n, d in subG.nodes(data=True) if d.get('kind') == 'movie')
    print(f"Ego graph: {sub_movies} movies, {sub_actors} actors, {len(subG.edges())} edges")

    # Prepare output directory
    output_dir = '../graph-js-demos/public/data'
    os.makedirs(output_dir, exist_ok=True)

    # Generate edges CSV
    edges_path = f'{output_dir}/kevin_bacon_edges.csv'
    edges = [(u, v) for u, v in subG.edges()]
    edges_df = pd.DataFrame(edges, columns=['Source', 'Target'])
    edges_df.to_csv(edges_path, index=False)
    print(f"Generated edges: {edges_path}")

    # Generate nodes CSV with metadata
    nodes_path = f'{output_dir}/kevin_bacon_nodes.csv'
    nodes_data = []

    for node_id in subG.nodes():
        node_attrs = G.nodes[node_id]
        kind = node_attrs.get('kind', 'unknown')

        if kind == 'movie':
            meta = movie_metadata.get(node_id, {})
            nodes_data.append({
                'id': node_id,
                'category': 'movie',
                'year': meta.get('year', ''),
                'rating': meta.get('rating', ''),
                'genre': meta.get('genre', ''),
                'certification': meta.get('certification', ''),
                'movies': ''  # Not applicable for movies
            })
        else:  # actor
            # Count how many movies this actor appears in (within the subgraph)
            actor_movies = [n for n in subG.neighbors(node_id)
                          if G.nodes[n].get('kind') == 'movie']
            nodes_data.append({
                'id': node_id,
                'category': 'actor',
                'year': '',
                'rating': '',
                'genre': '',
                'certification': '',
                'movies': len(actor_movies)
            })

    nodes_df = pd.DataFrame(nodes_data)
    nodes_df.to_csv(nodes_path, index=False)
    print(f"Generated nodes: {nodes_path}")

    # Also keep the old combined file for backwards compatibility
    old_path = f'{output_dir}/kevin_bacon.csv'
    edges_df.to_csv(old_path, index=False)
    print(f"Updated legacy file: {old_path}")

    print(f"\nSummary:")
    print(f"  Nodes: {len(subG.nodes())} ({sub_movies} movies, {sub_actors} actors)")
    print(f"  Edges: {len(subG.edges())}")

    # Show some sample data
    print(f"\nSample movies in network:")
    movie_nodes = [n for n in nodes_data if n['category'] == 'movie'][:5]
    for m in movie_nodes:
        print(f"  - {m['id']} ({m['year']}) - {m['rating']}★ - {m['genre']}")

if __name__ == '__main__':
    main()
