# Assignment WT - Big Data

As developers, we often face challenges handling large amounts of data where runtime execution or ordinary databases do not meet the requirements.
We might also have APIs with basic CRUD operations where we might want to query, aggregate, and visualize the data in other ways than the API intended. This is where the query engine Elasticsearch comes into play. Elasticsearch should not be seen as a database, but as a query engine. The data in Elasticsearch should always be replaceable and be able to be recreated.
Elasticsearch and similar query engines allow developers to create indexes from data and use the data in new ways that usually would have taken significant rewriting of applications.

## The assignment

Find a bigger _dataset_ and visualize something that you find interesting from the dataset. The visualization should be presented in a publicly reachable web application in the form of a diagram.

You can find datasets at https://www.kaggle.com/datasets, but you are free to explore and find something else.

It is recommended that you develop in the following steps:

1) Browse around to find a dataset
2) Write an application that gathers the data needed from the API and saves it in Elasticsearch
3) Use Kibana to find an interesting visualization
4) Write a web application with the visualization (#11)
5) Deploy the web application (#7)

## Requirements

Make sure to read [all requirements of the application](../../issues/). This includes: (#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11)
Pay extra attention to the labels indicating if the requirement is required (~"req::required") or optional (~"req::optional").

In this assignment, you must close issues and tasks ([ ]) that you implement. You must also create your issues (and close them) if you add any functionality.
