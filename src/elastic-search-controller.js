/**
 * Controller for ElasticSearch.
 *
 * @author Mats Loock
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import elasticsearch from '@elastic/elasticsearch'

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
  }

  async run () {
    try {
      const result = await this.client.search({
        index: 'all-summiters',
        query: {
          "match_all": {}
        }
      })
      console.log(result.hits.hits)
    } catch (error) {
      console.log('ERROR: ' + error)
    }

    await this.client.indices.create({
      index: 'summiters',
      mappings: 
      {
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

    try {
      const result = await this.client.search({
        index: 'summiters',
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
