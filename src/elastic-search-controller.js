/**
 * Controller for ElasticSearch.
 *
 * @author Mats Loock
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import elasticsearch from '@elastic/elasticsearch'
import csv from 'csvtojson'
import mappings from './mappings.js'

export class ElasticSearchController {

  constructor() {
    this.client = new elasticsearch.Client({
      node: 'https://localhost:9200',
      auth: {
        username: 'elastic',
        password: '0PjKNbbr1x9jAaK0A3Hh'
      },
      tls: { rejectUnauthorized: false }
    })

    this.indices = [
      'deaths',
      'expeditions',
      'peaks',
      'summiters'
    ]
  }

  async run (initiate) {

    if (initiate) {
      await this.deleteIndices()
      await this.createIndices()
      await this.addDocumentsFromCSV()
      await this.refreshIndices()
      await this.testSearch()
    }
  }

  async deleteIndices() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      const existsResponse = await this.client.indices.exists({ index: indexName })
      if (existsResponse)
        await this.client.indices.delete({ index: indexName })
    }
  }
  
  async addDocumentsFromCSV() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      await this.addBulkDocumentsFromCSV('././public/csv/' + indexName + '.csv', indexName)
    }
  }

  async addBulkDocumentsFromCSV(csvPath, indexName) {
    var jsonArray = await csv().fromFile(csvPath);
    await this.addBulkDocuments(indexName, jsonArray)
  }

  async addBulkDocuments(indexName, jsonArray) {
    const operations = jsonArray.flatMap(doc => [{ index: { _index: indexName } }, doc])
    const bulkResponse = await this.client.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
      const erroredDocuments = []
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            //operation: body[i * 2],
            //document: body[i * 2 + 1]
          })
        }
      })
      console.log(erroredDocuments)
    }
  
    const count = await this.client.count({ index: indexName })
    console.log(count)
  }

  async testSearch() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      try {
        const result = await this.client.search({
          index: indexName,
          query: {
            "match_all": {}
          }
        })
        console.log(result.hits.hits)
      } catch (error) {
        console.log('ERROR: ' + error)
      }
    }
  }

  async refreshIndices() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      await this.client.indices.refresh({ index: indexName })
    }
  }

  async createIndices() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      const existsResponse = await this.client.indices.exists({ index: indexName })
      if (!existsResponse)
        await this.client.indices.create( mappings[indexName] )
    }
  }

  async addTestDocument() {
    await this.client.index({
      index: 'summiters',
      document: 
      {
        peak_id: 'ACHN',
        peak_name: 'Aichyn',
        name: 'Kaya Ko',
        yr_season: '2015 Aut',
        date: 'Sep 03',
        time: '13:15',
        citizenship: 'Japan',
        gender: 'F',
        age: 23,
        is_o2_used: 'No',
        died_on_descent: '.',
        host_country: 'Nepal'
      }
    })
  }

}
