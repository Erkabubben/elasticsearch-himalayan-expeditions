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
    const results = await res.elasticSearchController.search({
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
    
    res.render('himalaya/peak', { peakData, climbStatus })
  }
}
