import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { openSuccess } from '../alerts/index'
 
const actions = {
  INVENTORY_GET_ALL: 'inventory/get_all',
  INVENTORY_GET_ALL_PENDING: 'inventory/get_all_PENDING',
  INVENTORY_CREATE: 'inventory/create',
  INVENTORY_UPDATE: 'inventory/update',
  INVENTORY_DELETE: 'inventory/delete',
  INVENTORY_REFRESH: 'inventory/refresh'
}

export let defaultState = {
  all: [],
  fetched: false
}

export const findInventory = createAction(actions.INVENTORY_GET_ALL, () => 
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory`)
    .then((suc) => {
      dispatch(refreshInventory(suc.data))
      dispatch(openSuccess("Retrieved all inventories"))
    })
)

export const createInventory = createAction(actions.INVENTORY_CREATE, (inventory) =>
  (dispatch, getState, config) => axios
    .post(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
      dispatch(openSuccess("Inventory created"))
    })
)

export const updateInventory = createAction(actions.INVENTORY_UPDATE, (inventory) =>
  (dispatch, getState, config) => axios
    .put(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
      dispatch(openSuccess("Inventory updated"))
    })
)

export const removeInventory = createAction(actions.INVENTORY_DELETE, (id) =>
  (dispatch, getState, config) => axios
    .delete(`${config.restAPIUrl}/inventory`, { data: id })
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (!id.includes(inv.id)) {
          invs.push(inv)
        }
      })
      dispatch(refreshInventory(invs))
      dispatch(openSuccess("Inventory deleted"))
    })
)

export const refreshInventory = createAction(actions.INVENTORY_REFRESH, (payload) =>
  (dispatcher, getState, config) =>
    payload.sort((inventoryA, inventoryB) => inventoryA.name < inventoryB.name ? -1 : inventoryA.name > inventoryB.name ? 1 : 0)
)

export default handleActions({
  [actions.INVENTORY_GET_ALL_PENDING]: (state) => ({
    ...state,
    fetched: false
  }),
  [actions.INVENTORY_REFRESH]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  })
}, defaultState)
