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
    console.log(results)

    var deathsFound = false

    if (deathsData.length > 0)
    {
      var deathsFound = true
    
      const deathsByYear = {}
      var deathYearsStr = ''
      var deathAmountsStr = ''
      var lowestYear = 10000
      var highestYear = -10000

      for (let i = 0; i < deathsData.length; i++) {
        const element = deathsData[i]._source
        const year = Number(element.yr_season.substring(0, 4))
        if (!(year in deathsByYear))
          deathsByYear[year] = 1
        else
          deathsByYear[year]++
        if (year < lowestYear)
          lowestYear = year
        if (year > highestYear)
          highestYear = year
      }

      for (let i = lowestYear; i < (highestYear + 1); i++) {
        if (!(i in deathsByYear))
          deathsByYear[i] = 0
        if (deathYearsStr !== '')
          deathYearsStr += ', ' + i
        else
          deathYearsStr += i
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
    }

    
    res.render('himalaya/peak', { peakData, climbStatus, deathsFound, deathYearsStr, deathAmountsStr })
  }
}
