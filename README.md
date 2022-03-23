# Welcome to METAweb!   
In this project we have created an interactive webpage that visualizes player and server statistics from the biggest Minecraft server at KTH, called METAcraft. The idea of this project arose when we all wanted to create a webpage with data that we ourselves were interested in. This led to us choosing to create a webpage based on METAcraft, as some of the group members were part of this server. When it comes to the idea to show server statistics, we were inspired by HeapCraft [1] in which data was explored and showed through visualization tools to gain a better understanding of player behavior and patterns.  
Much like HeapCraft, we also take in server stats as data which we receive from Player Analytics [2], but instead choose to display them on a webpage, in which users can directly interact and filter the data to gain a better understanding of the players and their patterns.  
The use of filtering is an essential part of Ben Shneiderman's Information Visualization Mantra [3]: "Overview first, zoom and filter, then details on demand". At first glance, we allow users to gain an overview of the server and the map, but also allowing the users to filter the players but also the server statistics to later be able to get details on demand.  
METAweb can therefore be used to find interesting player stats about yourself and other players at the server. The goal of METAweb is to enhance the player experience for both players and admins, and at the same time provide information on player behavior through heatmaps and statistics. 

The project is deployed at https://metawebb.herokuapp.com/ and works best when run on Google Chrome.

## Data  
Due to the lack of plug-in for positional data collection on minecraft fabric servers, the data for the heatmap was generated for this project. It was then stored on https://raw.githubusercontent.com/glas444/data/main/data.json. 
For the player and server statistics, the plug-in Player Analytics stored the data in an SQL database hosted on metacrafts hosting service Bloom Host. The database schema and more documentation on the plug-in can be found here https://github.com/plan-player-analytics/Plan/wiki/Database-Schema. 



## References   
[1] www.researchgate.net. (n.d.). (PDF) HeapCraft: interactive data exploration and visualization tools for understanding and influencing player behavior in Minecraft. [online] Available at: https://www.researchgate.net/publication/301463608_HeapCraft_interactive_data_exploration_and_visualization_tools_for_understanding_and_influencing_player_behavior_in_Minecraft.

[2] SpigotMC - High Performance Minecraft. (n.d.). Plan | Player Analytics. [online] Available at: https://www.spigotmc.org/resources/plan-player-analytics.32536/.

[3] Shneiderman, B. (n.d.). The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations. [online] Available at: https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf.

[4] Salvendy, G. ed., (2012). Handbook of Human Factors and Ergonomics. [online] Hoboken, NJ, USA: John Wiley & Sons, Inc. Available at: https://onlinelibrary.wiley.com/doi/book/10.1002/9781118131350.
