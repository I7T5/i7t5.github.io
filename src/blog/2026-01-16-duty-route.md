---
title: "On a quest for the best RA duty route"
pubDate: 2026-01-16
description: "We are rural postmen..."
author: "Ina Tang"
tags: ["algorithms", "graph theory", "math", "fun"]
isDraft: false
---

## the story

An anonymous resident assistant (RA) is trying to find the most efficient route to visit all the resident halls in her building starting from her own room and returning to it at the end of her rounds.
After the taking Theory of Algorithms, she realized that this sounds strangely similar to the Traveling Salesman Problem, which means, this is an algorithms problem. 

> [!QUESTION]- What is the Traveling Salesman Problem?
> The Traveling Salesman Problem is a classic problem in computer science and mathematics. It involves finding the shortest possible route that visits a set of cities (aka nodes, or vertices) exactly once and returns to the original city. It is related to the [Konigsberg Bridge Problem](https://www.britannica.com/science/Konigsberg-bridge-problem). 

Upon further investigation, she found that this problem is called the Rural Postman Problem (RPP), which is a variation of the Traveling Salesman Problem in that we're concerned with find the shortest route that visits a subset of edges ~~vertices~~ in a graph. In her case, the edges are the hallways connecting the resident halls, and the vertices are the exits/stairwells/connectors between halls.


## the setup

**Definitions**: 

Vertices: 
- Let each exit/stairwell/connector be a vertex. We will refer to these collectively as "exits" for simplicity. 
- Every exit will be represented by the smallest room number adjacent (including diagonally) to the exit. 

Edges: 
- (Also for simplicity) Let the number of rooms between two exits be the weight or cost of the edge connecting the two vertices, so we don't have to worry about actual distances. 
- The weight of one floor of stairs is to be determined, but for now we can assume it's equivalent to 5 rooms.\*
- We are considering A/B suites as two rooms for the purpose of counting distance, no matter if they are single, double, or triple occupancy.
- We are not double counting even-numbered and odd-numbered rooms since they are on opposite sides of the hall.

**Objective**:
The RA wants to minimize the total number of rooms she has to walk through to visit all halls, and, hopefully, end up back at her own room. (If the RA didn't care if she had to end up back at her own room, this would probably be an easier problem.)


## the journey

### First throughts: Preprocessing

![South-West Building Layout](/assets/blog/2026-01-16/sw_full.svg)

\*Assuming each floor is equivalent to 5 rooms. The distance between South Laundry and 201 is 10, or more accurately, two floors. 

The graph represents the South-West building layout with vertices as exits, stairwells, or corners and edges weighted by the number of rooms between exits. Notice the vertices are ordered left to right according to west to south, and each layer represents a floor of the building.

Since West Lobby, 022, 025, Old MAP, 117, 120, and 325 are singularly connected to the rest of the graph, we can ignore them for the purpose of finding a shortest Hamiltonian Cycle. But I will add the extra distance for doubling back on them to the final sum as a constant anyways, just for precision/fun. 

Now the graph looks like this:
![Simplified South-West Building Layout](/assets/blog/2026-01-16/sw_no-singular.svg)

### If the RA doesn't need to return to her room...

This is probably an easier problem than the Rural Postman Problem (RPP), but it is not the problem I want to deal with right now...

### If the RA needs to return to her room...

Then this would be an instance of the undirected RPP with a fixed starting point. 

> [!QUESTION]- What exactly is the Rural Postman Problem?
> Given a graph $G = (V, E)$ and $E'\subseteq E$ a subset of the edges of the graph (and no particular starting point), find the shortest closed path (cycle) that traverses every edge in that $E'$ at least once and return to the starting point. 
> This is a general version of the better known [Chinese Postman Problem](https://en.wikipedia.org/wiki/Chinese_postman_problem). 

Several algorithms exist to solve the RPP. [Christofides et al. (1981)](https://www.researchgate.net/publication/239385320_An_algorithm_for_the_Rural_Postman_Problem) proposed one of the first[^1] exact algorithms to solve the RPP without approximation using a technique called branch and bound. More recently, [Gutin, Wahlström, and Yeo (2017)](https://www.sciencedirect.com/science/article/pii/S0022000016300411) proposed an exact algorithms that runs in $O(2^k)$ time, where $k$ is the number of weakly connected components in the subgraph of $G$ induced by $E'$ (whatever that means) based on Eulerian extensions. 

While Christofides et al.'s algorithm does not make any sense for me, Gutin, Walstrom, and Yeo's algorithms based actually looks approachable and interesting (with Eulerian extensions). However, with school starting again I don't have the time to implement them 😭. But I did get to find a couple solutions better than the one I used just from the graph already: 

![Solution 1](/assets/blog/2026-01-16/sw_sol1.jpg)

![Solution 2](/assets/blog/2026-01-16/sw_sol2.jpg)

I suppose we can call these solutions "greedy" or "heuristic", where we are minimizing extra stairs, after taking all the stairs that we need to walk into account.

That's all my findings for now. 

[^1]: Don't quote me on this. There might be earlier algorithms, but this is the first one I found in my quick search, and I don't have access to big journals etc. 