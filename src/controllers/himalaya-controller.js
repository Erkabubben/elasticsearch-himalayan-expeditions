/**
 * Module for the HimalayaController.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class HimalayaController {
  /**
   * Retrieves the Issues list from GitLab and displays the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async index (req, res, next) {
    const results = await res.elasticSearchController.search({
      index: 'peaks',
      size: 1000,
      query: {
        "match_all": {}
      }
    })
    const hits = results.hits.hits
    //console.log(results.hits.hits)
    
    res.render('himalaya/index', { peaks: hits } )
  }

  async peak (req, res, next) {
    var results = await res.elasticSearchController.search({
      index: 'peaks',
      size: 1,
      query: {
        "term": {
          peak_id: req.query.peaks
        }
      }
    })
    const peakData = results.hits.hits[0]._source
    const climbStatus = (peakData.climb_status === 'Climbed')
    //console.log(peakData)

    results = await res.elasticSearchController.search({
      index: 'deaths',
      size: 10000,
      //filter_path : ['hits.hits._source.yr_season'],
      query: {
        "term": {
          peak_id: req.query.peaks
        }
      }
    })
    const deathsData = results.hits.hits
    console.log(deathsData)

    const deathsByYear = {}
    var deathYearsStr = ''
    var deathAmountsStr = ''

    for (let i = 1900; i < 2023; i++) {
      deathsByYear[i] = 0
      if (deathYearsStr !== '')
        deathYearsStr += ', ' + i
      else
        deathYearsStr += i
    }

    for (let i = 0; i < deathsData.length; i++) {
      const element = deathsData[i]._source
      deathsByYear[element.yr_season.substring(0, 4)]++
    }

    for (let key in deathsByYear) {
      const element = deathsByYear[key]
      if (deathAmountsStr !== '')
        deathAmountsStr += ', ' + element
      else
        deathAmountsStr += element
    }

    //console.log(deathsByYear)
    console.log(deathYearsStr)
    console.log(deathAmountsStr)
    
    res.render('himalaya/peak', { peakData, climbStatus, deathYearsStr, deathAmountsStr })
  }
}
