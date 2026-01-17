import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialData } from "@/lib/mock-data";

interface FinancialsTableProps {
  data: FinancialData[];
}

export function FinancialsTable({ data }: FinancialsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Year</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Net Income</TableHead>
            <TableHead className="text-right">Op. Cash Flow</TableHead>
            <TableHead className="text-right">Free Cash Flow</TableHead>
            <TableHead className="text-right">Gross Margin</TableHead>
            <TableHead className="text-right">Net Margin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.year}>
              <TableCell className="font-medium">{row.year}</TableCell>
              <TableCell className="text-right">{row.revenue}</TableCell>
              <TableCell className="text-right">{row.netIncome}</TableCell>
              <TableCell className="text-right">{row.operatingCashFlow}</TableCell>
              <TableCell className="text-right">{row.freeCashFlow}</TableCell>
              <TableCell className="text-right">{row.grossMargin}</TableCell>
              <TableCell className="text-right">{row.netMargin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}