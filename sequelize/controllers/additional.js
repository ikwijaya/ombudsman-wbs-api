const { models } = require('..');
const { Sequelize, Op } = require('sequelize')
const core = require('./core')

module.exports = {
  /**
   * 
   * @returns 
   */
  async complaintAdditional() {
    try {
      let legal_standing = await models.legal_standing.findAll({
        attributes: ['idx_m_legal_standing', 'name'],
        where: { record_status: 'A' }
      });

      let violations = await models.violations.findAll({
        attributes: ['idx_m_violation', 'name'],
        where: { record_status: 'A' }
      });

      let work_units = await models.work_units.findAll({
        attributes: ['idx_m_work_unit', 'name'],
        where: { record_status: 'A' }
      })

      let region_cities = await models.cities.findAll({
        attributes: ['idx_m_city', 'name'],
        include: [{
          required: false,
          model: models.regions,
          attributes: ['name', 'regional']
        }],
        where: { record_status: 'A' },
      });

      let options = await models.options.findAll({
        attributes: ['text', 'value'],
        where: { option_id: '1' }
      });

      return {
        legal_standing: legal_standing,
        violations: violations,
        work_units: work_units,
        region_cities: region_cities,
        options: options
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @returns 
   */
  async complaintFilterAdditional(r = [], sid = null) {
    try {
      let where = {}
      let status = await models.status.findAll(
        {
          raw: true,
          attributes: [
            'idx_m_status', 'color',
            [`name`, 'name'],
            [`name`, 'status_name'],
            [Sequelize.literal(`code`), 'value']
          ],
          order: [
            [Sequelize.literal('cast(code as integer)'), 'ASC']
          ]
        },
      )

      let regional = await models.regions.findAll({
        attributes: [
          [Sequelize.literal(`concat('Regional ',regional)`), 'regional']
        ],
        group: ['regional'],
        order: [[Sequelize.literal('cast(regional as integer)'), 'ASC']]
      }).catch(e => { throw (e) })


      if (r.length > 0) where['regional'] = { [Op.in]: r }
      let region = await models.regions.findAll({
        attributes: ['idx_m_region', 'name'],
        where: where,
        order: [
          ['name', 'ASC']
        ]
      }).catch(e => { throw (e) })

      let sessions = await core.checkSession(sid);
      let isPublic = false;
      if (sessions.length === 0 && sessions[0].user_type == 'PUBLIC')
        isPublic = true;

      // teradu
      // let teradu = await models.complaint_study_reported.findAll(
      //   {
      //     attributes: ['name'],
      //     group: ['name']
      //   }
      // );
      let teradu = await models.work_units.findAll({
        attributes: ['idx_m_work_unit', 'name']
      })

      // terperiksa
      let terperiksa = await models.clarification_detail.findAll(
        {
          attributes: ['name'],
          group: ['name']
        }
      );

      return {
        status: status,
        regional: regional,
        region: region,
        teradu: !isPublic ? teradu : [],
        terperiksa: !isPublic ? terperiksa : []
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @returns 
   */
  async studyAdditional() {
    try {
      let dispositions = await models.dispositions.findAll({
        attributes: ['idx_m_disposition', 'name'],
        where: {
          record_status: 'A',
          flag: {
            [Op.in]: ['1', '3']
          }
        }
      });

      let violations = await models.violations.findAll({
        attributes: ['idx_m_violation', 'name'],
        where: { record_status: 'A' }
      });

      let work_units = await models.work_units.findAll({
        attributes: ['idx_m_work_unit', 'name'],
        where: { record_status: 'A' }
      })

      let region_cities = await models.cities.findAll({
        attributes: [
          'idx_m_city', 'name',
        ],
        include: [
          {
            required: false,
            model: models.regions,
            attributes: ['name'],
          }
        ],
        where: { record_status: 'A' },
      });

      return {
        dispositions: dispositions,
        violations: violations,
        work_units: work_units,
        region_cities: region_cities
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @returns 
   */
  async decisionAdditional() {
    try {
      let dispositions = await models.dispositions.findAll({
        attributes: ['idx_m_disposition', 'name'],
        where: {
          record_status: 'A',
          flag: {
            [Op.in]: ['1', '2']
          }
        },
        order: [['name', 'ASC']]
      });

      let violations = await models.violations.findAll({
        attributes: ['idx_m_violation',
          [Sequelize.literal(`concat('(',cast(idx_m_violation as varchar),') ',name)`), 'name']],
        where: { record_status: 'A' },
        order: [['idx_m_violation', 'ASC']]
      });

      return {
        dispositions: dispositions,
        violations: violations
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @returns 
   */
  async determinationAdditional() {
    try {
      let users = await models.users.findAll({
        raw: true,
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 2 }
      });

      let wbs = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 6 }
      });

      return {
        users: users,
        wbs: wbs
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @returns 
   */
  async usersAdditional(sid, id) {
    try {
      let usertypes = await models.usertypes.findAll({
        attributes: ['idx_m_user_type', 'name'],
        where: {
          record_status: 'A',
          idx_m_user_type: {
            [Op.ne]: -1
          }
        }
      });

      let roles = []

      return {
        usertypes: usertypes,
        roles: roles
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   */
  async validationAdditional(id) {
    try {
      let steps = await models.options.findAll(
        {
          attributes: ['value', 'text'],
          where: {
            option_id: '4'
          },
          order: [
            ['order_no', 'ASC']
          ]
        }
      )

      let checklists = await models.options.findAll(
        {
          attributes: ['value', 'text'],
          where: {
            option_id: '5'
          },
          order: [
            ['order_no', 'ASC']
          ]
        }
      )

      let media = await models.options.findAll(
        {
          attributes: ['value', 'text'],
          where: {
            option_id: '3'
          },
          order: [
            ['order_no', 'ASC']
          ]
        }
      )

      let regional = await models.regions.findAll({
        raw: true,
        attributes: ['regional'],
        include: [
          {
            required: true,
            attributes: [],
            model: models.cities,
            group: ['regional'],
            include: [
              {
                required: true,
                attributes: [],
                model: models.complaint_study_incidents,
                include: [
                  {
                    required: true,
                    attributes: [],
                    model: models.complaint_studies,
                    where: { idx_m_complaint: id }
                  }
                ]
              }
            ],
          }
        ]
      })

      let head_regional = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        include: [{
          required: true,
          model: models.userregion,
          where: { regional: { [Op.in]: regional.map(e => e.regional) } }
        }],
        where: { record_status: 'A', idx_m_user_type: 4 }
      });

      let head_kumm = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });

      let product = await models.options.findAll(
        {
          attributes: ['value', 'text'],
          where: {
            option_id: '6'
          },
          order: [
            ['order_no', 'ASC']
          ]
        }
      )

      return {
        steps: steps,
        checklists: checklists,
        media: media,
        by: ['TERADU', 'PENGADU'],
        head_regional: head_regional,
        head_kumm: head_kumm,
        product: product
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   */
  async verificationAdditional() {
    try {
      let types = await models.complaint_rejected_types.findAll(
        {
          attributes: ['idx_m_complaint_rejected_type', 'name'],
          where: { record_status: 'A' }
        }
      )

      return {
        types: types
      }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * user_type  | note
   *    2       | admin kumm
   *    3       | user kumm
   * @returns 
   */
  async closingAdditional(id) {
    try {
      let regional = await models.regions.findAll({
        raw: true,
        attributes: ['regional'],
        include: [
          {
            required: true,
            attributes: [],
            model: models.cities,
            group: ['regional'],
            include: [
              {
                required: true,
                attributes: [],
                model: models.complaint_study_incidents,
                include: [
                  {
                    required: true,
                    attributes: [],
                    model: models.complaint_studies,
                    where: { idx_m_complaint: id }
                  }
                ]
              }
            ],
          }
        ]
      })

      let head_regional = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        include: [{
          model: models.userregion,
          where: { regional: { [Op.in]: regional.map(e => e.regional) } }
        }],
        where: { record_status: 'A', idx_m_user_type: 4 }
      });

      let head_kumm = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });

      let head_wbs = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 5 }
      });

      return {
        head_regional: head_regional,
        head_kumm: head_kumm,
        head_wbs: head_wbs
      }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * 
   * @returns 
   */
  async studylysAdditional(id) {
    try {
      let violations = await models.violations.findAll(
        {
          attributes: ['idx_m_violation', 'name'],
          where: { record_status: 'A' }
        }
      )

      let legal_standing = await models.legal_standing.findAll({
        attributes: ['idx_m_legal_standing', 'name'],
        where: { record_status: 'A' }
      });

      let regional = await models.regions.findAll({
        raw: true,
        attributes: ['regional'],
        include: [
          {
            required: true,
            attributes: [],
            model: models.cities,
            group: ['regional'],
            include: [
              {
                required: true,
                attributes: [],
                model: models.complaint_study_incidents,
                include: [
                  {
                    required: true,
                    attributes: [],
                    model: models.complaint_studies,
                    where: { idx_m_complaint: id }
                  }
                ]
              }
            ],
          }
        ]
      })

      let head_regional = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        include: [{
          model: models.userregion,
          where: { regional: { [Op.in]: regional.map(e => e.regional) } }
        }],
        where: { record_status: 'A', idx_m_user_type: 4 }
      });

      let head_kumm = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });

      let scopes = [
        {
          text: "Pemeriksaan Laporan",
          value: 1,
        },
        {
          text: "Pencegahan",
          value: 2,
        },
      ]

      return {
        violations: violations,
        legal_standing: legal_standing,
        head_regional: head_regional,
        head_kumm: head_kumm,
        scopes: scopes
      }
    } catch (error) {
      throw (error)
    }
  },

  /**
   * 
   */
  async requestAdditional() {
    try {
      let media = await models.options.findAll(
        {
          attributes: ['value', 'text'],
          where: {
            option_id: '3'
          },
          order: [
            ['order_no', 'ASC']
          ]
        }
      )

      let approvers = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name'],
          'occupation'
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });

      return {
        media: media,
        by: ['TERADU', 'PENGADU'],
        approvers: approvers
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  async clarificationAdditional(id) {
    try {
      let users = await models.complaint_determination_users.findAll(
        {
          raw: true,
          attributes: [],
          include: [
            {
              attributes: ['fullname', 'email', 'idx_m_user'],
              model: models.users,
              include: [
                {
                  attributes: ['name'],
                  model: models.usertypes
                }
              ]
            },
            {
              attributes: ['idx_m_complaint'],
              model: models.complaint_determinations,
              where: { idx_m_complaint: id }
            }
          ]
        }
      )
      let head_kumm = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });

      console.log('users => ', users)
      return {
        users: users,
        head_kumm: head_kumm
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  async lhpaAdditional(id) {
    try {
      let users = await models.complaint_determination_users.findAll(
        {
          raw: true,
          attributes: [],
          include: [
            {
              attributes: ['fullname', 'email', 'idx_m_user'],
              model: models.users,
              include: [
                {
                  attributes: ['name'],
                  model: models.usertypes
                }
              ]
            },
            {
              attributes: ['idx_m_complaint'],
              model: models.complaint_determinations,
              where: { idx_m_complaint: id }
            }
          ]
        }
      )
      let head_kumm = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 3 }
      });
      let types = [
        {
          value: 0,
          text: "Penyelesaian Laporan",
        },
        {
          value: 1,
          text: "Pencegahan",
        },
      ]
      let reports = [
        [
          "PVL",
          "Pemeriksaan Laporan",
          "Resolusi dan Monitoring",
          "Penutupan/Penyelesaian Laporan",
        ],
        ["Deteksi", "Analisis", "Survei", "Perlakuan Pelaksanaan Saran"],
      ];
      let conclusions = [
        "Tidak terdapat temuan",
        "Temuan administratif",
        "Temuan substantif",
        "Temuan prosedural",
      ];

      return {
        users: users,
        head_kumm: head_kumm,
        types: types,
        reports: reports,
        conclusions: conclusions,
      }
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  async surgeryAdditional(id) {
    try {
      let users = await models.complaint_determination_users.findAll(
        {
          raw: true,
          attributes: [],
          include: [
            {
              attributes: ['fullname', 'email', 'idx_m_user'],
              model: models.users,
              include: [
                {
                  attributes: ['name'],
                  model: models.usertypes
                }
              ]
            },
            {
              attributes: ['idx_m_complaint'],
              model: models.complaint_determinations,
              where: { idx_m_complaint: id }
            }
          ]
        }
      )
      let results = [
        {
          text: "LHPA <b>BELUM/TIDAK</b> dapat dilanjutkan ke Rapat Pleno",
          value: 1,
          color: 'red',
          selected: false
        },
        {
          text: "LHPA dapat diajukan ke Rapat Pleno",
          value: 2,
          color: 'green',
          selected: false
        },
      ];

      let wbs = await models.users.findAll({
        attributes: [
          'idx_m_user',
          [Sequelize.literal(`concat(users.fullname,' - ', users.email)`), 'name']
        ],
        where: { record_status: 'A', idx_m_user_type: 6 }
      });

      return {
        users: users,
        results: results,
        wbs: wbs
      }
    } catch (err) {
      console.log(err)
    }
  },
}