"use client";
import { useState, useMemo, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Export the interface
export interface ColumnDefinition<T> {
  id: string;
  name: string;
  align?: "center" | "left" | "right";
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { sn: number }> {
  data: T[];
  columns: ColumnDefinition<T>[];
  initialColumnVisibility: Record<string, boolean>;
  searchPlaceholder: string;
  addLabel: string;
  onAddClick: () => void;
  onEditClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  searchKey: keyof T;
}

export default function DataTable<T extends { sn: number }>({
  data,
  columns,
  initialColumnVisibility,
  searchPlaceholder,
  addLabel,
  onAddClick,
  searchKey,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(initialColumnVisibility);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    return data.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, searchKey]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map((item) => item.sn));
      setSelectedRows(newSelected);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (sn: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(sn);
      } else {
        newSelected.delete(sn);
      }
      return newSelected;
    });
  };

  const handleColumnVisibilityChange = (columnId: string, checked: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: checked,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const allRowsSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRows.has(item.sn));
  const someRowsSelected =
    paginatedData.some((item) => selectedRows.has(item.sn)) && !allRowsSelected;

  console.log(someRowsSelected);

  return (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-8 pr-4 py-2 h-10 w-full rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 px-4 bg-transparent">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Customize Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={columnVisibility[column.id]}
                    onCheckedChange={(checked) =>
                      handleColumnVisibilityChange(column.id, checked)
                    }
                  >
                    {column.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={"outline"}
              className="h-10 px-4"
              onClick={onAddClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              {addLabel}
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 overflow-auto px-4 hide-scrollbar ">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allRowsSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                  />
                </TableHead>
                {columns
                  .filter((col) => columnVisibility[col.id])
                  .map((column) => (
                    <TableHead
                      key={column.id}
                      className={column.align === "center" ? "text-center" : ""}
                    >
                      {column.name}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.sn}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(item.sn)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item.sn, checked as boolean)
                      }
                      aria-label={`Select row ${item.sn}`}
                      className="translate-y-[2px]"
                    />
                  </TableCell>
                  {columns
                    .filter((col) => columnVisibility[col.id])
                    .map((column) => (
                      <TableCell
                        key={column.id}
                        className={
                          column.align === "center" ? "text-center" : ""
                        }
                      >
                        {column.render
                          ? column.render(item)
                          : // @ts-expect-error Accessing property by string key
                            item[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Section - Fixed */}
      <div className="flex-shrink-0 border-t bg-background p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            {selectedRows.size} of {filteredData.length} row(s) selected.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}