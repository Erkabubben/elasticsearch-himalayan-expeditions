/**
 * Controller for ElasticSearch.
 *
 * @author Mats Loock
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

import elasticsearch from '@elastic/elasticsearch'
import csv from 'csvtojson'
import mappings from './mappings.js'

/**
 * Encapsulates the ElasticSearch controller.
 */
export class ElasticSearchController {
  /**
   * Constructor for the ElasticSearch controller.
   *
   * @param {string} esPort - The port number that the ElasticSearch instance is running on.
   * @param {string} esUsername - The username used to connect to the ElasticSearch instance.
   * @param {string} esPassword - The password used to connect to the ElasticSearch instance.
   */
  constructor (esPort, esUsername, esPassword) {
    this.client = new elasticsearch.Client({
      node: 'https://localhost:' + esPort,
      auth: {
        username: esUsername,
        password: esPassword
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

  /**
   * Deletes all indices in ElasticSearch then sets up new indices and adds data from CSV files.
   */
  async init () {
    await this.deleteIndices()
    await this.createIndices()
    await this.addDocumentsFromCSV()
    await this.refreshIndices()
    await this.testSearch()
  }

  /**
   * Deletes all indices in ElasticSearch.
   */
  async deleteIndices () {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i]
      const existsResponse = await this.client.indices.exists({ index: indexName })
      if (existsResponse) {
        await this.client.indices.delete({ index: indexName })
      }
    }
  }

  /**
   * Iterates all CSV's defined in this.indices and adds their contents to ElasticSearch.
   */
  async addDocumentsFromCSV () {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i]
      await this.addBulkDocumentsFromCSV('././public/csv/' + indexName + '.csv', indexName)
    }
  }

  /**
   * Converts a CSV file to a JSON array and adds its contents to ElasticSearch.
   *
   * @param {string} csvPath - The path to the CSV file to be parsed.
   * @param {string} indexName - The name of the index that the CSV data should be added to.
   */
  async addBulkDocumentsFromCSV (csvPath, indexName) {
    const jsonArray = await csv().fromFile(csvPath)
    await this.addBulkDocuments(indexName, jsonArray)
  }

  /**
   * Adds the contents of a JSON array to an ElasticSearch index.
   *
   * @param {string} indexName - The name of the index that the JSON data should be added to.
   * @param {Array} jsonArray - An array of JSON objects with data to be added to ElasticSearch.
   */
  async addBulkDocuments (indexName, jsonArray) {
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
            error: action[operation].error
            // operation: body[i * 2],
            // document: body[i * 2 + 1]
          })
        }
      })
      console.log(erroredDocuments)
    }

    const count = await this.client.count({ index: indexName })
    console.log(count)
  }

  /**
   * Executes an ElasticSearch search request and returns the results.
   *
   * @param {string} searchRequest - The search request to be executed.
   * @param {boolean} printResults - Whether or not the results should be printed to the console upon completion.
   * @returns {object} - The search results.
   */
  async search (searchRequest, printResults = false) {
    try {
      const results = await this.client.search(searchRequest)
      if (printResults) {
        console.log(results.hits.hits)
      }
      return results
    } catch (error) {
      console.log('ERROR: ' + error)
    }
  }

  /**
   * Refreshes all indices defined in the this.indices array.
   */
  async refreshIndices () {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i]
      await this.client.indices.refresh({ index: indexName })
    }
  }

  /**
   * Iterates the this.indices array and creates new indices based on the definitions in
   * the mappings.js file.
   */
  async createIndices () {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i]
      const existsResponse = await this.client.indices.exists({ index: indexName })
      if (!existsResponse) {
        await this.client.indices.create(mappings[indexName])
      }
    }
  }

  /**
   * Returns an array of JSON objects with the peak_id, peak_name and climb_status of all peaks defined
   * in the peaks index. Also adds bools indicating whether the peak has been climbed and whether it
   * is the currently selected peak. Used to set up the peaks select element.
   *
   * @param {string} peak - The peak_id of the currently selected peak.
   * @returns {Array} - An array of JSON objects containing peak data.
   */
  async getPeaks (peak) {
    const results = await this.search({
      index: 'peaks',
      size: 1000,
      filter_path: ['hits.hits._source.peak_id', 'hits.hits._source.peak_name', 'hits.hits._source.climb_status'],
      query: {
        match_all: {}
      }
    })

    for (let i = 0; i < results.hits.hits.length; i++) {
      // Adds isClimbed bool based on climb_status so that Handlebars can display either a cross or a checkmark.
      results.hits.hits[i]._source.isClimbed = (results.hits.hits[i]._source.climb_status[0] !== 'U')
      // Adds the currentlySelected bool if the peak has been selected. Used to set the default option of the
      // peak select element.
      if (results.hits.hits[i]._source.peak_id === peak) {
        results.hits.hits[i]._source.currentlySelected = true
      }
    }

    return results.hits.hits
  }
}
