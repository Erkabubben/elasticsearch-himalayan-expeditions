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
      //'expeditions',
      'peaks',
      'summiters'
    ]
  }

  async run () {

    await this.deleteIndices()
    await this.createIndices()
    //await this.addTestDocument()
    await this.addDocumentsFromCSV()

    await this.refreshIndices()

    await this.testSearch()
  }

  async deleteIndices() {
    for (let i = 0; i < this.indices.length; i++) {
      const indexName = this.indices[i];
      const existsResponse = await this.client.indices.exists({ index: indexName })
      if (existsResponse)
        await this.client.indices.delete({ index: indexName })
    }
    //await this.client.indices.delete({ index: 'deaths' })
    //await this.client.indices.delete({ index: 'expeditions' })
    //await this.client.indices.delete({ index: 'peaks' })
    //await this.client.indices.delete({ index: 'summiters' })
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
            operation: body[i * 2],
            document: body[i * 2 + 1]
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
    await this.client.indices.create({
      index: 'deaths',
      mappings: {
          "properties": {
          "age": {
            "type": "long"
          },
          "cause_of_death": {
            "type": "keyword"
          },
          "citizenship": {
            "type": "keyword"
          },
          "date": {
            "type": "keyword"
          },
          "gender": {
            "type": "keyword"
          },
          "is_o2_used": {
            "type": "keyword"
          },
          "is_summiter": {
            "type": "keyword"
          },
          "name": {
            "type": "text"
          },
          "peak_id": {
            "type": "keyword"
          },
          "peak_name": {
            "type": "keyword"
          },
          "time": {
            "type": "keyword"
          },
          "yr_season": {
            "type": "keyword"
          }
        }
      }
    })
    await this.client.indices.create({
      index: 'expeditions',
      mappings: {
          "properties": {
          "accidents": {
            "type": "text"
          },
          "achievements": {
            "type": "text"
          },
          "agency": {
            "type": "text"
          },
          "approach": {
            "type": "text"
          },
          "bc_arrived": {
            "type": "date",
            "format": "iso8601"
          },
          "bc_left": {
            "type": "date",
            "format": "iso8601"
          },
          "camp_sites": {
            "type": "keyword"
          },
          "exp_result": {
            "type": "keyword"
          },
          "had_o2": {
            "type": "long"
          },
          "high_camps": {
            "type": "long"
          },
          "hired_abc": {
            "type": "long"
          },
          "hired_deaths": {
            "type": "long"
          },
          "hired_summits": {
            "type": "long"
          },
          "host_cntr": {
            "type": "keyword"
          },
          "is_claim": {
            "type": "long"
          },
          "is_commercial_rte": {
            "type": "long"
          },
          "is_disputed": {
            "type": "long"
          },
          "is_no_hired_abc": {
            "type": "long"
          },
          "is_o2_climbing": {
            "type": "long"
          },
          "is_o2_descent": {
            "type": "long"
          },
          "is_o2_medical": {
            "type": "long"
          },
          "is_o2_not_used": {
            "type": "long"
          },
          "is_o2_sleeping": {
            "type": "long"
          },
          "is_o2_unkwn": {
            "type": "long"
          },
          "is_o2_used": {
            "type": "long"
          },
          "is_parapente": {
            "type": "long"
          },
          "is_ski_snowboard": {
            "type": "long"
          },
          "is_standard_rte": {
            "type": "long"
          },
          "is_traverse": {
            "type": "long"
          },
          "leaders": {
            "type": "keyword"
          },
          "max_elev_reached": {
            "type": "long"
          },
          "mbrs_deaths": {
            "type": "long"
          },
          "mbrs_summited": {
            "type": "long"
          },
          "members": {
            "type": "text"
          },
          "nationality": {
            "type": "keyword"
          },
          "other_cntrs": {
            "type": "text"
          },
          "other_smts": {
            "type": "text"
          },
          "peak_id": {
            "type": "keyword"
          },
          "peak_name": {
            "type": "keyword"
          },
          "rope_fixed": {
            "type": "long"
          },
          "rte_1_name": {
            "type": "text"
          },
          "rte_2_name": {
            "type": "text"
          },
          "season": {
            "type": "keyword"
          },
          "sponsor": {
            "type": "text"
          },
          "summit_day": {
            "type": "date",
            "format": "iso8601"
          },
          "summit_days": {
            "type": "long"
          },
          "team_asc_1": {
            "type": "keyword"
          },
          "team_asc_2": {
            "type": "keyword"
          },
          "term_note": {
            "type": "text"
          },
          "time": {
            "type": "keyword"
          },
          "total_days": {
            "type": "long"
          },
          "total_mbrs": {
            "type": "long"
          },
          "year": {
            "type": "long"
          }
        }
      }
    })
    await this.client.indices.create({
      index: 'peaks',
      mappings: {
          "properties": {
          "alternative_names": {
            "type": "text"
          },
          "climb_status": {
            "type": "keyword"
          },
          "countries": {
            "type": "keyword"
          },
          "first_asc_date": {
            "type": "keyword"
          },
          "first_asc_season": {
            "type": "keyword"
          },
          "first_asc_yr": {
            "type": "long"
          },
          "first_summiters": {
            "type": "text"
          },
          "height_ft": {
            "type": "long"
          },
          "height_m": {
            "type": "long"
          },
          "host_contries": {
            "type": "keyword"
          },
          "is_open": {
            "type": "long"
          },
          "is_trekking": {
            "type": "long"
          },
          "is_unlisted": {
            "type": "long"
          },
          "location": {
            "type": "keyword"
          },
          "peak_id": {
            "type": "keyword"
          },
          "peak_name": {
            "type": "keyword"
          },
          "region": {
            "type": "keyword"
          },
          "restrictions": {
            "type": "text"
          },
          "summiters_notes": {
            "type": "text"
          },
          "trek_year": {
            "type": "long"
          }
        }
      }
    })
    await this.client.indices.create({
      index: 'summiters',
      mappings: {
          "properties": {
          "age": {
            "type": "long"
          },
          "citizenship": {
            "type": "keyword"
          },
          "date": {
            "type": "keyword"
          },
          "died_on_descent": {
            "type": "keyword"
          },
          "gender": {
            "type": "keyword"
          },
          "host_country": {
            "type": "keyword"
          },
          "is_o2_used": {
            "type": "keyword"
          },
          "name": {
            "type": "text"
          },
          "peak_id": {
            "type": "keyword"
          },
          "peak_name": {
            "type": "keyword"
          },
          "time": {
            "type": "keyword"
          },
          "yr_season": {
            "type": "keyword"
          }
        }
      }
    })
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
