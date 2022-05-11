export default {

  deaths: {
    index: 'deaths',
    mappings: {
      properties: {
        age: {
          type: 'long'
        },
        cause_of_death: {
          type: 'keyword'
        },
        citizenship: {
          type: 'keyword'
        },
        date: {
          type: 'keyword'
        },
        gender: {
          type: 'keyword'
        },
        is_o2_used: {
          type: 'keyword'
        },
        is_summiter: {
          type: 'keyword'
        },
        name: {
          type: 'text'
        },
        peak_id: {
          type: 'keyword'
        },
        peak_name: {
          type: 'keyword'
        },
        time: {
          type: 'keyword'
        },
        yr_season: {
          type: 'keyword'
        }
      }
    }
  },
  expeditions: {
    index: 'expeditions',
    mappings: {
      properties: {
        accidents: {
          type: 'text'
        },
        achievements: {
          type: 'text'
        },
        agency: {
          type: 'text'
        },
        approach: {
          type: 'text'
        },
        bc_arrived: {
          type: 'date',
          format: 'iso8601'
        },
        bc_left: {
          type: 'date',
          format: 'iso8601'
        },
        camp_sites: {
          type: 'keyword'
        },
        exp_result: {
          type: 'keyword'
        },
        had_o2: {
          type: 'long'
        },
        high_camps: {
          type: 'long'
        },
        hired_abc: {
          type: 'long'
        },
        hired_deaths: {
          type: 'long'
        },
        hired_summits: {
          type: 'long'
        },
        host_cntr: {
          type: 'keyword'
        },
        is_claim: {
          type: 'long'
        },
        is_commercial_rte: {
          type: 'long'
        },
        is_disputed: {
          type: 'long'
        },
        is_no_hired_abc: {
          type: 'long'
        },
        is_o2_climbing: {
          type: 'long'
        },
        is_o2_descent: {
          type: 'long'
        },
        is_o2_medical: {
          type: 'long'
        },
        is_o2_not_used: {
          type: 'long'
        },
        is_o2_sleeping: {
          type: 'long'
        },
        is_o2_unkwn: {
          type: 'long'
        },
        is_o2_used: {
          type: 'long'
        },
        is_parapente: {
          type: 'long'
        },
        is_ski_snowboard: {
          type: 'long'
        },
        is_standard_rte: {
          type: 'long'
        },
        is_traverse: {
          type: 'long'
        },
        leaders: {
          type: 'keyword'
        },
        max_elev_reached: {
          type: 'long'
        },
        mbrs_deaths: {
          type: 'long'
        },
        mbrs_summited: {
          type: 'long'
        },
        members: {
          type: 'text'
        },
        nationality: {
          type: 'keyword'
        },
        other_cntrs: {
          type: 'text'
        },
        other_smts: {
          type: 'text'
        },
        peak_id: {
          type: 'keyword'
        },
        peak_name: {
          type: 'keyword'
        },
        rope_fixed: {
          type: 'long'
        },
        rte_1_name: {
          type: 'text'
        },
        rte_2_name: {
          type: 'text'
        },
        season: {
          type: 'keyword'
        },
        sponsor: {
          type: 'text'
        },
        summit_day: {
          type: 'date',
          format: 'iso8601'
        },
        summit_days: {
          type: 'long'
        },
        team_asc_1: {
          type: 'keyword'
        },
        team_asc_2: {
          type: 'keyword'
        },
        term_note: {
          type: 'text'
        },
        time: {
          type: 'keyword'
        },
        total_days: {
          type: 'long'
        },
        total_mbrs: {
          type: 'long'
        },
        year: {
          type: 'long'
        }
      }
    }
  },
  peaks: {
    index: 'peaks',
    mappings: {
      properties: {
        alternative_names: {
          type: 'text'
        },
        climb_status: {
          type: 'keyword'
        },
        countries: {
          type: 'keyword'
        },
        first_asc_date: {
          type: 'keyword'
        },
        first_asc_season: {
          type: 'keyword'
        },
        first_asc_yr: {
          type: 'long'
        },
        first_summiters: {
          type: 'text'
        },
        height_ft: {
          type: 'long'
        },
        height_m: {
          type: 'long'
        },
        host_contries: {
          type: 'keyword'
        },
        is_open: {
          type: 'long'
        },
        is_trekking: {
          type: 'long'
        },
        is_unlisted: {
          type: 'long'
        },
        location: {
          type: 'keyword'
        },
        peak_id: {
          type: 'keyword'
        },
        peak_name: {
          type: 'keyword'
        },
        region: {
          type: 'keyword'
        },
        restrictions: {
          type: 'text'
        },
        summiters_notes: {
          type: 'text'
        },
        trek_year: {
          type: 'long'
        }
      }
    }
  },
  summiters: {
    index: 'summiters',
    mappings: {
      properties: {
        age: {
          type: 'long'
        },
        citizenship: {
          type: 'keyword'
        },
        date: {
          type: 'keyword'
        },
        died_on_descent: {
          type: 'keyword'
        },
        gender: {
          type: 'keyword'
        },
        host_country: {
          type: 'keyword'
        },
        is_o2_used: {
          type: 'keyword'
        },
        name: {
          type: 'text'
        },
        peak_id: {
          type: 'keyword'
        },
        peak_name: {
          type: 'keyword'
        },
        time: {
          type: 'keyword'
        },
        yr_season: {
          type: 'keyword'
        }
      }
    }
  }
}
