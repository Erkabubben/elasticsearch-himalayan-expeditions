/**
 * Module for the HimalayaController.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HimalayaController {
  /**
   * Retrieves a list of peaks from ElasticSearch and displays the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    res.render('himalaya/index', { peaks: await res.elasticSearchController.getPeaks(req.query.peaks) })
  }

  /**
   * Displays a page with information about a selected peak.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async peak (req, res, next) {
    let results = await res.elasticSearchController.search({
      index: 'peaks',
      size: 1,
      query: {
        term: {
          peak_id: req.query.peaks
        }
      }
    })

    const peakData = results.hits.hits[0]._source
    const climbStatus = (peakData.climb_status === 'Climbed')

    results = await res.elasticSearchController.search({
      index: 'deaths',
      size: 10000,
      query: {
        term: {
          peak_id: req.query.peaks
        }
      }
    })

    const deathsData = results.hits.hits

    results = await res.elasticSearchController.search({
      index: 'summiters',
      size: 30000,
      query: {
        term: {
          peak_id: req.query.peaks
        }
      }
    })

    const summitersData = results.hits.hits

    /**
     * Takes data from an ElasticSearch search call and returns a years-amounts object.
     *
     * @param {Array} data - Data retrieved from ElasticSearch.
     * @param {string} propertyName - Name of the property containing the year.
     * @returns {object} - Object with year-amount key-value pairs.
     */
    function getDataByYear (data, propertyName) {
      const byYear = {}

      for (let i = 0; i < data.length; i++) {
        const element = data[i]._source
        const year = Number(element[propertyName].substring(0, 4))
        if (!(year in byYear)) {
          byYear[year] = 1
        } else {
          byYear[year]++
        }
      }

      return byYear
    }

    /**
     * Displays a page with information about a selected peak.
     *
     * @param {Array} byYearsArray - Array of objects with year-amount key-value pairs.
     * @returns {object} - Object with data to be inserted into Handlebars.
     */
    function getYearsAndAmounts (byYearsArray) {
      let lowestYear = 10000
      let highestYear = -10000

      const obj = {
        yearStrings: [],
        amountStrings: [],
        displayAnyChart: false,
        displayCharts: []
      }

      byYearsArray.forEach(byYears => {
        for (const key in byYears) {
          const year = Number(key)
          if (year < lowestYear) {
            lowestYear = year
          }
          if (year > highestYear) {
            highestYear = year
          }
        }

        obj.displayCharts.push(Object.keys(byYears).length > 0)
      })

      obj.displayAnyChart = (lowestYear < 10000 && highestYear > -10000)

      byYearsArray.forEach(byYears => {
        let yearsStr = ''
        let amountsStr = ''

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
    const yearsAndAmounts = getYearsAndAmounts([deathsByYears, summitersByYears])

    res.render('himalaya/peak', {
      peaks: await res.elasticSearchController.getPeaks(req.query.peaks),
      peakData,
      climbStatus,
      displayAnyChart: yearsAndAmounts.displayAnyChart,
      years: yearsAndAmounts.yearStrings[0],
      deathAmounts: yearsAndAmounts.amountStrings[0],
      displayDeaths: yearsAndAmounts.displayCharts[0],
      summiterAmounts: yearsAndAmounts.amountStrings[1],
      displaySummiters: yearsAndAmounts.displayCharts[1],
      totalSummiters: summitersData.length,
      totalDeaths: deathsData.length
    })
  }
}
