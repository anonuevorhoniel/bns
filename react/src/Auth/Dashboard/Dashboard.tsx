import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UseMuni } from "@/Actions/MunicipalityAction";
import { useEffect } from "react";
import AutoPagination from "@/Reusable/AutoPagination";
import { UseLayout } from "@/Actions/LayoutAction";
import LoadingScreen from "@/LoadingScreen";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Building2,
    ChartArea,
    GraduationCap,
    Sheet,
    Users,
    UsersRound,
} from "lucide-react";

export default function Dashboard() {
    const {
        municipalities,
        getMunicipalities,
        page,
        setPage,
        total_page,
        total_scholars,
        loading,
        allMuni,
        getAllMuni,
    } = UseMuni();

    const { setItem, setBItem } = UseLayout();

    useEffect(() => {
        setItem("Dashboard");
        setBItem(null);
        getAllMuni();
    }, []);

    useEffect(() => {
        getMunicipalities(page);
    }, [page]);

    const chartConfig = {
        total: {
            label: "total",
            color: "green",
        },
    } satisfies ChartConfig;
    const chartData =
        allMuni &&
        Object.values(allMuni).map((m: any) => ({
            Municipality: m.name,
            Scholars: m.sc_total,
        }));

    useEffect(() => {
        console.log(allMuni);
    }, []);

    return (
        <>
            <title>BNS | Dashboard</title>
            <div className="w-full">
                <Tabs defaultValue="bar">
                    <TabsList>
                        <TabsTrigger value="bar">
                            <ChartArea /> Chart
                        </TabsTrigger>
                        <TabsTrigger value="table">
                            <Sheet />
                            Table
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="bar">
                        <Card className="p-0">
                            <div className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                                    <CardTitle>Scholars</CardTitle>
                                    <CardDescription>
                                        Breakdown of Scholars per Municipality /
                                        City
                                    </CardDescription>
                                </div>
                                <div className="text-2xl text-blue-900 rounded-tr-lg p-5 pl-10 border-1">
                                    <div className="text-blue-900 text-sm mt-3 flex justify-center items-center">
                                        <Label className="text-md">
                                            Total Scholars
                                        </Label>
                                        <GraduationCap
                                            size={30}
                                            className="ml-4"
                                        />
                                    </div>
                                    <div className="font-bold">
                                        {total_scholars ||
                                        total_scholars == 0 ? (
                                            total_scholars
                                        ) : (
                                            <div className="ml-3">
                                                <TailChase
                                                    size="25"
                                                    speed="1.75"
                                                    color="blue"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="px-2 sm:p-6">
                                <ChartContainer
                                    config={chartConfig}
                                    className="aspect-auto h-[250px] w-full"
                                >
                                    <BarChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="Municipality"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            minTickGap={32}
                                            tickFormatter={(value) => {
                                                return value;
                                            }}
                                        />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    className="w-[150px]"
                                                    nameKey="views"
                                                    labelFormatter={(value) => {
                                                        return value;
                                                    }}
                                                />
                                            }
                                        />
                                        <Bar
                                            dataKey={"Scholars"}
                                            fill={`var(--color-${"total"})`}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="table">
                        <Card>
                            <div className="p-0  relative mb-3 mt-3 rounded-lg">
                                {loading && <LoadingScreen />}
                                <Table className="">
                                    <TableHeader className="border-b border-black">
                                        <TableRow className="">
                                            <TableHead className="text-center rounded-tl-lg text-black/50">
                                                #
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex justify-center opacity-70">
                                                    {" "}
                                                    <Label>
                                                        {" "}
                                                        <Building2
                                                            size={15}
                                                        />{" "}
                                                        Municipality
                                                    </Label>
                                                </div>
                                            </TableHead>
                                            <TableHead className="flex justify-center opacity-70">
                                                <Label>
                                                    <UsersRound size={15} />{" "}
                                                    Total Scholars
                                                </Label>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {municipalities &&
                                            Object.values(municipalities).map(
                                                (m: any) => {
                                                    return (
                                                        <TableRow key={m.id}>
                                                            <TableCell className="text-center ">
                                                                {m.id}
                                                            </TableCell>
                                                            <TableCell className="text-center ">
                                                                {m.name}
                                                            </TableCell>
                                                            <TableCell className="text-center ">
                                                                {m.sc_total}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="grid grid-cols-2 pr-6">
                                <div></div>
                                <div>
                                    <div className="float-right">
                                        <AutoPagination
                                            totalPage={total_page}
                                            page={page}
                                            setPage={setPage}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
