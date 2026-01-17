import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialData } from "@/lib/mock-data";
import { useLanguage } from "@/lib/LanguageContext";

interface FinancialsTableProps {
  data: FinancialData[];
}

export function FinancialsTable({ data }: FinancialsTableProps) {
  const { t, isRtl } = useLanguage();
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRtl ? "text-right w-[100px]" : "w-[100px]"}>{t("year")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("revenue")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("net_income")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("op_cash_flow")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("free_cash_flow")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("gross_margin")}</TableHead>
            <TableHead className={isRtl ? "text-left" : "text-right"}>{t("net_margin")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.year}>
              <TableCell className="font-medium">{row.year}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.revenue}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.netIncome}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.operatingCashFlow}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.freeCashFlow}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.grossMargin}</TableCell>
              <TableCell className={isRtl ? "text-left" : "text-right"}>{row.netMargin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}