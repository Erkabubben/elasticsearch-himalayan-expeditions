/**
 * Module for the IssuesController.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Retrieves the Issues list from GitLab and displays the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async index (req, res, next) {
    

    const results = await res.elasticSearchController.summitersSearch()
    const hits = results.hits.hits
    console.log(results.hits.hits)
    
    res.render('real-time-issues/index', { searchResults: hits } )
  }

  /**
   * Retrieves the Issues list from GitLab and displays the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  /*async index (req, res, next) {
    try {
      // Retrieve Issues list from GitLab by API call
      const url = process.env.GITLAB_API_PROJECT_ISSUES_URL
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + process.env.ACCESS_TOKEN
        }
      })
      const responseJSON = await response.json()
      // Parse response data to an array of Issue objects
      const issues = []
      responseJSON.forEach(element => {
        const issue = {
          title: element.title,
          description: element.description,
          issueid: element.iid,
          userAvatar: element.author.avatar_url,
          userUsername: element.author.username,
          userFullname: element.author.name
        }
        if (element.closed_at !== null) issue.done = true
        else issue.done = false
        issues.push(issue)
      })
      // Render the index page based on the Issues data
      res.render('real-time-issues/index', { issues })
    } catch (error) {
      next(error)
    }
  }*/
}
