# This notebook and parts of the implementation are adapted from:
# https://www.kaggle.com/code/benjaminnuttin/six-degrees-of-kevin-bacon/notebook
# Full credit and attribution to Benjamin Nuttin for the dataset structure, 
# graph-building concepts, and some code inspiration. 
# Please refer to the original Kaggle notebook for further details, methodology,
# and the original author's comments and analysis.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import networkx as nx
import ast

movies = pd.read_csv('data.csv')
movies.head()

movies_imp = movies[['Movie Name', 'Stars']]
movies_imp.head()

# The graph will be undirected - the relationship between a movie and its actors is symmetric, so we will use nx.Graph()
G = nx.Graph()
all_stars = []

for index, movie in movies.iterrows():
    title = movie['Movie Name']
    # Interpret str representation of a list into an actual list
    stars = ast.literal_eval(movie['Stars'])
    # Add the movie as a movie node
    G.add_node(title, kind="movie", color="blue")
    for star in stars:
        # For each star, add an actor node if they havent been added yet
        G.add_node(star, kind="actor", color="yellow")
        all_stars.append(star)
        # Finally we add the edge between the actor and the movie
        G.add_edge(title, star)

# Now let's do some visualizations
actor_nodes = [n for n,v in G.nodes(data=True) if v['kind'] == 'actor']  
print(str(len(actor_nodes)) + " actors in the graph")
print(str(len(G.edges)) + " edges in the graph")

# This is too much to draw, so we will instead draw a small subgraph, focused on Kevin Bacon
# First we show the movies he's in
subG = nx.ego_graph(G, 'Kevin Bacon', radius=1, center=True)
plt.figure(figsize=(20,10))
nx.draw_networkx(subG, with_labels=True, node_color=[node[1]['color'] for node in subG.nodes(data=True)], node_size=30, font_size=11)
plt.show()

# Then we expand to the actors in *those* movies
subG = nx.ego_graph(G, 'Kevin Bacon', radius=2, center=True)
plt.figure(figsize=(20,10))
nx.draw_networkx(subG, with_labels=True, node_color=[node[1]['color'] for node in subG.nodes(data=True)], node_size=30, font_size=11)
plt.show()

# The kamada_kawai layout helps a bit with legibility
subG = nx.ego_graph(G, 'Kevin Bacon', radius=2, center=True)
plt.figure(figsize=(20,10), dpi= 100, facecolor='w', edgecolor='k')
nx.draw(subG, pos=nx.kamada_kawai_layout(subG), with_labels=True, node_color=[node[1]['color'] for node in subG.nodes(data=True)], node_size=30, font_size=13)
plt.show()

# Looking at the graph centered on a specific movies instead
subG = nx.ego_graph(G, 'Apollo 13', radius=2, center=True)
plt.figure(figsize=(20,10), dpi= 100, facecolor='w', edgecolor='k')
nx.draw(subG, pos=nx.kamada_kawai_layout(subG), with_labels=True, node_color=[node[1]['color'] for node in subG.nodes(data=True)], node_size=30, font_size=13)
plt.show()

# Set up a formatter that leverages node attributes
def format_kb_path(actor, path):
    hop_count = 0
    output = ""
    for idx, node in enumerate(path):
        kind = G.nodes[node]['kind']
        if kind == 'actor':
            if idx == 0:
                output += node + " was in '"
            elif idx == len(path)-1:
                output += node + "\n"
            else:
                output += node + ", who was in '"
        else:
            hop_count += 1
            output += node + "'\n>> which also had "
    output = "[" + actor + " - " + str(hop_count) + " degrees]\n" + output
    return output, hop_count

# Use dijkstra_path to calculate the shortest path between the actor of interest and Kevin Bacon
def find_kb_path(actor):
    try:
        dijpath = nx.dijkstra_path(G, source=actor, target='Kevin Bacon')
        output, hop_count = format_kb_path(actor, dijpath)
    except nx.NodeNotFound:
        output = "[" + actor + " - Not in database]\n"
        hop_count = 0
    except nx.NetworkXNoPath:
        output = "[" + actor + " - Not linked to Kevin Bacon!]\n"
        hop_count = 0
    return output, hop_count

    # Let's test on a set of random actors:
import random
random_actors = random.sample(actor_nodes, 10)
for a in random_actors:
    output, hop_count = find_kb_path(a)
    print(output)

    # Who are the most prolific actors? And the movies with the most actors?
actor_degrees = sorted([(node, val) for (node, val) in G.degree if G.nodes[node]['kind'] == 'actor'], key=lambda x: x[1], reverse=True)
movie_degrees = sorted([(node, val) for (node, val) in G.degree if G.nodes[node]['kind'] == 'movie'], key=lambda x: x[1], reverse=True)
print(actor_degrees[:5])
print(movie_degrees[:5])

# Finally, we will compute a histogram of the distances between every actor in our graph and Kevin Bacon
# WARNING - TAKES ABOUT 10 MINUTES TO RUN
degrees_hist = []
for actor in actor_nodes:
    output, hop_count = find_kb_path(actor)
    degrees_hist.append(hop_count)

bins = np.arange(10) - 0.5
counts, edges, bars = plt.hist(degrees_hist, bins=bins, rwidth=0.9)

labels = []
total = sum(counts)
for count in counts:
    label = str(round(count)) + " (" + str(round(100*count/total)) + "%)"
    labels.append(label)

plt.bar_label(bars, labels)
plt.xticks(range(8))
plt.title('Degrees of Kevin Bacon Across Movies Dataset')
plt.xlabel('Degrees')
plt.ylabel('Actors')
plt.show()