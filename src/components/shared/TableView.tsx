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

export type RecipeTableView = {
    $id:string
    RecipeName: string
    status:"Draft" | "Submitted" | "Approved" | "Published"
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

      const[open, setOpen] = useState(false);

 
      return (
        <DropdownMenu>
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
            <DropdownMenuItem  onClick={()=>setOpen(true)}>
            <img 
                  src = '/assets/icons/delete.svg'
                  alt='delete'
                  width = {24}
                  height = {24}
                  />
            </DropdownMenuItem>
          </DropdownMenuContent>
          <Modal open={open} onClose={()=>setOpen(false)} recipe={recipe as any}></Modal>
        </DropdownMenu>
        
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
      })
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
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
    </div>
  )
}

export default TableView