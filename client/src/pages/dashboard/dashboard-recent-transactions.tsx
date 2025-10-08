import { Link } from "react-router-dom";
import TransactionTable from "../../components/transaction/transaction-table";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { PROTECTED_ROUTES } from "../../routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="!shadow-none border border-gray-200 bg-white">
      <CardHeader className="!pb-0">
        <CardTitle className="text-xl text-[#002B4C]">Recent Transactions</CardTitle>
        <CardDescription className="text-[#333333]">
          Showing all recent transactions
        </CardDescription>
        <CardAction>
          <Button
            asChild
            variant="link"
            className="!text-[#14A0C4] !font-normal"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
          </Button>
        </CardAction>
        <Separator className="mt-3 !bg-gray-200" />
      </CardHeader>
      <CardContent className="pt-0">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
