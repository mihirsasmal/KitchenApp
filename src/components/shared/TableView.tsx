import React, { useState } from 'react'
import { ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable, } from "@tanstack/react-table"
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
      } from "@/components/ui/table"
import { formatDate } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import { Input } from '../ui/input'
import ShareModal from './ShareModal'
import { useUserContext } from '@/context/AuthContext'
import PublishModal from './PublishModal'
import { Checkbox } from "@/components/ui/checkbox"

export type RecipeTableView = {
    $id:string
    RecipeName: string
    status:string
    shared:string
    lastUpdatedBy :string
    lastUpdatedOn :Date
    likes:number
    saves:number
    MealType:string
    cuisineType:string
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
  }

 

export const columns:ColumnDef<RecipeTableView>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
{
    accessorKey:'RecipeName',
    id:'RecipeName',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            RecipeName
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },    
    enableHiding: false,
},
{
    accessorKey:'status',
    id:'Status',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell:({row})=>{
        const recipe = row.original;
        return (recipe as any).Publish?'Published':'Private';
    }
},
{
  accessorKey:'shared',
  id:'Shared',
  header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shared
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=>{
      const recipe = row.original;
      return (recipe as any).share.length>0?'Shared':'';
  }
},
{
    accessorKey:'creator.name',
    id:'Last Updated By',
    header:'Last Updated By'
},
{
    accessorKey:'$updatedAt',
    id:'Last Updated On',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated On
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell:({row})=>{
        const formattedValue = formatDate(row.getValue('Last Updated On'));
        return formattedValue;
    }
},
{
    accessorKey:'MealType',
    id:'MealType',
    header:'Meal Type'
},
{
    accessorKey:'CuisineType',
    id:'CuisineType',
    header:'Cuisine Type'
},
{
    accessorKey:'likes.length',
    id:'Likes',
    header:'Likes'
},
{
    accessorKey:'saved.length',
    id:'Saves',
    header:'Saves'
},
{
    id: "actions",
    cell: ({ row }) => {
      const recipe = row.original;
      const {user} = useUserContext();
      const[open, setOpen] = useState(false);
      const[shareOpen, setShareOpen] = useState(false);
      const[publishOpen, setPublishOpen] = useState(false);
      const sharedUser = (recipe as any).share.filter((x:any)=>{const tempSharedUser = JSON.parse(x); if(tempSharedUser.userId=== user.id) return x;}).map((x:any)=>JSON.parse(x));
      
      return ( (user.id ===(recipe as any).creator.$id)  ?
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">            
            <DropdownMenuItem>
            <Link to={`/update-recipe/${recipe.$id}`} className='p-0.5'>
                <img src = '/assets/icons/edit.svg' alt = 'edit' width={20} height = {20} />                
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={()=>setOpen(true)}>
            <img 
                  src = '/assets/icons/delete.svg'
                  alt='delete'
                  width = {24}
                  height = {24}
                  />
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={()=>setShareOpen(true)}>
            <img 
                  src = '/assets/icons/share.svg'
                  alt='share'
                  width = {24}
                  height = {24}
                  />
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={()=>setPublishOpen(true)}>
            <img 
                  src = '/assets/icons/publish.svg'
                  alt='share'
                  width = {32}
                  height = {32}
                  />
            </DropdownMenuItem>
          </DropdownMenuContent>
          <Modal open={open} onClose={()=>setOpen(false)} recipe={recipe as any}></Modal>
          <ShareModal open={shareOpen} onClose={()=>setShareOpen(false)} recipe={recipe as any}></ShareModal>
          <PublishModal open={publishOpen} onClose={()=>setPublishOpen(false)} recipe={recipe as any}></PublishModal>
        </DropdownMenu>
        : (sharedUser.length>0 && sharedUser[0].canEdit)? <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">            
          <DropdownMenuItem>
          <Link to={`/update-recipe/${recipe.$id}`}>
              <img src = '/assets/icons/edit.svg' alt = 'edit' width={20} height = {20}/>                
          </Link>
          </DropdownMenuItem>         
        </DropdownMenuContent>
      </DropdownMenu>:<></>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
 function TableView<TData, TValue> ({
    columns,
    data,
  }: DataTableProps<TData, TValue>)  {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
      const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
      })

      const[shareOpen, setShareOpen] = useState(false);
      const[publishOpen, setPublishOpen] = useState(false);
      const [selectedRecipe, setSelectedRecipe] = useState([]);
  return (
    <div className='w-full'>
        <div className="flex items-center gap-3 py-4">
        <Input
          placeholder="Filter recipes..."
          value={(table.getColumn("RecipeName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("RecipeName")?.setFilterValue(event.target.value)
          }
          className="shad-input "
        /> 
        {table.getFilteredSelectedRowModel().rows.length>0?<> <Button
                  onClick = {()=>{setSelectedRecipe(table.getFilteredSelectedRowModel().rows.map((x)=>{ return x.original as any}) as any);  setShareOpen(true) }}
                  variant = 'ghost'
                  className={'ghost_details-delete_btn p-0 '}
                >
                  <img 
                  src = '/assets/icons/share.svg'
                  alt='share'
                  width = {32}
                  height = {32}
                  />
                  </Button>

                  <Button
                  onClick = {()=>{setSelectedRecipe(table.getFilteredSelectedRowModel().rows.map((x)=>{ return x.original as any}) as any);  setPublishOpen(true); }}
                  variant = 'ghost'
                  className={'ghost_details-delete_btn px-2 pb-1 '}
                >
                  <img 
                  src = '/assets/icons/publish.svg'
                  alt='publish'
                  width = {35}
                  height = {35}
                  />
                  </Button> 
                  </>:<></>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Show / Hide Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-center"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>      
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
<ShareModal open={shareOpen} onClose={()=>{setShareOpen(false); setRowSelection({})}} recipeList={selectedRecipe as any}></ShareModal>
          <PublishModal open={publishOpen} onClose={()=>{setPublishOpen(false); setRowSelection({})}} recipeList={selectedRecipe as any}></PublishModal>
    </div>
    
  )
}

export default TableView