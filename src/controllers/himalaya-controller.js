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
    console.log(peakData)

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
    //console.log(deathsData)
    //console.log(results)

    var deathsFound = false
    
    results = await res.elasticSearchController.search({
      index: 'summiters',
      size: 10000,
      //filter_path : ['hits.hits._source.yr_season'],
      query: {
        "term": {
          peak_id: req.query.peaks
        }
      }
    })

    const summitersData = results.hits.hits
    console.log(summitersData)
    console.log(results)

    function getDataByYear(data, propertyName) {
      const byYear = {}

      for (let i = 0; i < data.length; i++) {
        const element = data[i]._source
        const year = Number(element[propertyName].substring(0, 4))
        if (!(year in byYear))
          byYear[year] = 1
        else
          byYear[year]++
      }

      return byYear
    }

    function getYearsAndAmounts(byYearsArray) {

      var lowestYear = 10000
      var highestYear = -10000
      const obj = {
        yearStrings: [],
        amountStrings: [],
        displayAnyChart: false,
        displayCharts: []
       }

      byYearsArray.forEach(byYears => {
        for (let key in byYears) {
          const year = Number(key)
          if (year < lowestYear)
            lowestYear = year
          if (year > highestYear)
            highestYear = year
        }

        obj.displayCharts.push(Object.keys(byYears).length > 0)
      })

      obj.displayAnyChart = (lowestYear < 10000 && highestYear > -10000)

      byYearsArray.forEach(byYears => {

        var yearsStr = ''
        var amountsStr = ''

        for (let i = lowestYear; i < (highestYear + 1); i++) {
          yearsStr += yearsStr !== '' ? ', ' + i : i

          if (i in byYears) {
            const element = byYears[i]
            amountsStr += amountsStr !== '' ? ', ' + element : element
          } else {
            amountsStr += amountsStr !== '' ? ', ' + 0 : 0
          }
        }

        obj.yearStrings.push(yearsStr)
        obj.amountStrings.push(amountsStr)
      })

      return obj
    }

    const deathsByYears = getDataByYear(deathsData, 'yr_season')
    const summitersByYears = getDataByYear(summitersData, 'yr_season')
    const yearsAndAmounts = getYearsAndAmounts([ deathsByYears, summitersByYears ])

    console.log(yearsAndAmounts)

    res.render('himalaya/peak', {
      peakData,
      climbStatus,
      displayAnyChart: yearsAndAmounts.displayAnyChart,
      years: yearsAndAmounts.yearStrings[0],
      deathAmounts: yearsAndAmounts.amountStrings[0],
      displayDeaths: yearsAndAmounts.displayCharts[0],
      summiterAmounts: yearsAndAmounts.amountStrings[1],
      displaySummiters: yearsAndAmounts.displayCharts[1]
    })
  }
}
