import * as inventoryDuck from '../ducks/inventory'
import * as productDuck from '../ducks/products'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { MeasurementUnits } from '../constants/units'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, stableSort } from '../components/Table'
import InventoryFormModal from '../components/Inventory/InventoryFormModal'
import InventoryDeleteModal from '../components/Inventory/InventoryDeleteModal'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  }
}))

const normalizeInventory = (inventory) => inventory.map(inv => ({
  ...inv,
  unitOfMeasurement: MeasurementUnits[inv.unitOfMeasurement].name,
  bestBeforeDate: moment(inv.bestBeforeDate).format('MM/DD/YYYY')
}))

const headCells = [
  { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
  { id: 'productType', align: 'right', disablePadding: false, label: 'Product' },
  { id: 'description', align: 'right', disablePadding: false, label: 'Description' },
  { id: 'amount', align: 'right', disablePadding: false, label: 'Amount' },
  { id: 'unitOfMeasurement', align: 'right', disablePadding: false, label: 'Unit of Measurement' },
  { id: 'bestBeforeDate', align: 'right', disablePadding: false, label: 'Best Before Date' },
]

const InventoryLayout = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const inventories = useSelector(state => state.inventory.all)
  const products = useSelector(state => state.products.all)
  const isFetched = useSelector(state => state.inventory.fetched && state.products.fetched)
  const createInventory = useCallback(inventory => { dispatch(inventoryDuck.createInventory(inventory)) }, [dispatch])
  const updateInventory = useCallback(inventory => { dispatch(inventoryDuck.updateInventory(inventory)) }, [dispatch])
  const removeInventory = useCallback(inventory => { dispatch(inventoryDuck.removeInventory(inventory)) }, [dispatch])
  
  useEffect(() => {
    if (!isFetched) {
      dispatch(inventoryDuck.findInventory())
      dispatch(productDuck.findProducts())
    }
  }, [dispatch, isFetched])

  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [isEditOpen, setEditOpen] = React.useState(false)
  const [isDeleteOpen, setDeleteOpen] = React.useState(false)
  const toggleCreate = () => {
    setCreateOpen(true)
  }
  const toggleEdit = () => {
    setEditOpen(true)
  }
   const toggleDelete = () => {
    setDeleteOpen(true)
  }
  const toggleModals = (resetSelected) => {
    setCreateOpen(false)
    setEditOpen(false)
    setDeleteOpen(false)
    if (resetSelected) {
      setSelected([])
    }
  }
  
  const normalizedInventory = normalizeInventory(inventories)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = normalizedInventory.map((row) => row.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }
  
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const firstSelectedInventoryValues = inventories.filter(inventory => inventory.id===selected[0])[0]
  if (selected.length !== 0) {
    firstSelectedInventoryValues.bestBeforeDate=
      moment(firstSelectedInventoryValues.bestBeforeDate).format('YYYY-MM-DD')
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          title='Inventory'
          toggleCreate={toggleCreate}
          toggleEdit={toggleEdit}
          toggleDelete={toggleDelete}
        />
        <TableContainer component={Paper}>
          <Table size='small' stickyHeader>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={normalizedInventory.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(normalizedInventory, getComparator(order, orderBy))
                .map(inv => {
                  const isItemSelected = isSelected(inv.id)
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, inv.id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={inv.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox checked={isItemSelected}/>
                      </TableCell>
                      <TableCell padding='none'>{inv.name}</TableCell>
                      <TableCell align='right'>{inv.productType}</TableCell>
                      <TableCell align='right'>{inv.description}</TableCell>
                      <TableCell align='right'>{inv.amount}</TableCell>
                      <TableCell align='right'>{inv.unitOfMeasurement}</TableCell>
                      <TableCell align='right'>{inv.bestBeforeDate}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <InventoryFormModal
          title='Edit'
          formName='inventoryEdit'
          isDialogOpen={isEditOpen}
          handleDialog={toggleModals}
          handleInventory={updateInventory}
          initialValues={firstSelectedInventoryValues}
          products={products}
          measurementUnits={MeasurementUnits}
          
        />
        <InventoryFormModal
          title='Create'
          formName='inventoryCreate'
          isDialogOpen={isCreateOpen}
          handleDialog={toggleModals}
          handleInventory={createInventory}
          initialValues={{
            description: '',
            amount: 0,
            averagePrice:0,
            bestBeforeDate: moment(new Date()).format('YYYY-MM-DD')
          }}
          products={products}
          measurementUnits={MeasurementUnits}
        />
        <InventoryDeleteModal
          isDialogOpen={isDeleteOpen}
          handleDelete={removeInventory}
          handleDialog={toggleModals}
          initialValues={selected}
        />
      </Grid>
    </Grid>
  )
}

export default InventoryLayout
