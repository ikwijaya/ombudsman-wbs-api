'use strict'

const { response } = require('../../models/index')
const core = require('../core')

/**
 * Using for logout with public web
 */
class PublicMenu {
  /**
   * 
   * @param {*} sid 
   * @returns 
   */
  getMenu(sid = null) {
    let data = []

    return new Promise(async (resolve, reject) => {
      await core.checkSession(sid).then((r) => {
        if (r.status) {
          data = [
            {
              form_name: 'home',
              form_icon: 'mdi-home',
              form_color: 'black',
              form_url: '/home'
            },
            {
              form_name: 'my-complaint',
              form_icon: null,
              form_color: 'black',
              form_url: '/pengaduan'
            },
            {
              form_name: 'contact',
              form_icon: 'mdi-home',
              form_color: 'black',
              form_url: '/contact'
            }
          ]
        } else {
          data = [
            {
              form_name: 'home',
              form_icon: 'mdi-home',
              form_color: 'black',
              form_url: '/home'
            },
            {
              form_name: 'login',
              form_icon: null,
              form_color: 'black',
              form_url: '/login'
            },
            {
              form_name: 'contact',
              form_icon: null,
              form_color: 'black',
              form_url: '/contact'
            }
          ]
        }

        resolve(response.success(null, data))
      }).catch((e) => { reject(e) })
    })
  }
}

module.exports = PublicMenu