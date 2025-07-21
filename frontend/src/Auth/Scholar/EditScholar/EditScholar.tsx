import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { UseLayout } from "@/Actions/LayoutAction";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScholarEdit } from "@/Actions/ScholarAction";
import { Toaster } from "sonner";
import Elegibility from "../ScholarForm/Eligibility";
import Incentive from "../ScholarForm/Incentive";
import Training from "../ScholarForm/Training";
import Beneficiary from "../ScholarForm/Beneficiary";
import AdditionalInformation from "../ScholarForm/AddtionalInfo/AdditionalInformation";
import Location from "../ScholarForm/Location";
import PersonalInformation from "../ScholarForm/PersonalInformation";
import { ScholarformSchema } from "../../../Validation/Scholarformschema";
import LoadingScreen from "@/LoadingScreen";
import ScholarValueSet from "./ScholarValueSet";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EditScholar() {
    const { setItem, setBItem } = UseLayout();
    const [loading, setLoading] = useState(false);
    const { scholarData, getScholarData, clearScholarData, update } =
        ScholarEdit();
    const { form, setFormBulk } = useCreateScholarForm();
    const [eligibilities, setEligibilities] = useState([]);
    const [trainings, setTrainings] = useState<any>([]);
    const id = useParams().id;

    useEffect(() => {
        setItem("Scholars");
        setBItem("Edit");
        clearScholarData();
        getScholarData({ id, setEligibilities, setTrainings }); 
    }, []);

    const defaultValues = {
        first_name: "",
        name_on_id: "",
        id_no: "",
        benificiary_name: "",
        relationship: "",
        classification: "",
        philhealth_no: "",
        birth_date: "",
        civil_status: "",
        complete_address: "",
        middle_name: "",
        last_name: "",
        sex: "",
        contact_number: "",
        district_id: "",
        citymuni_id: "",
        barangay_id: "",
        status: "",
        bns_type: "",
        place_of_assignment: "",
        educational_attainment: "",
        first_employment_date: "",
        fund: "",
        incentive_prov: "",
        incentive_mun: "",
        incentive_brgy: "",
        replacement_date: "",
        replaced_scholar_id: "",
    };

    const scholarForm = useForm<any>({
        resolver: zodResolver(ScholarformSchema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        if (scholarData) {
            const updated = ScholarValueSet({ scholarData, defaultValues });
            scholarForm.reset(updated);
            setTimeout(() => {
                setFormBulk(updated);
            }, 100);
        }
    }, [scholarData]);

    const handleSubmit = () => {
        update({ form, setLoading, id, eligibilities, trainings });
    };

    if (!scholarData) return <LoadingScreen />;
    return (
        <>
            <Toaster />
            <title>BNS | Edit Scholar</title>
            <Link to={"/scholars"}>
                <Button variant={"primary"} className="text-xs h-8">
                    <CircleArrowLeft className="w-8" /> Back
                </Button>
            </Link>
            <Card className="mt-5 pt-0">
                <Form {...scholarForm}>
                    <form onSubmit={scholarForm.handleSubmit(handleSubmit)}>
                        <PersonalInformation
                            scholarForm={scholarForm}
                            scholarData={scholarData}
                        />
                        <Separator />
                        <Location
                            scholarForm={scholarForm}
                            scholarData={scholarData}
                        />
                        <Separator />
                        <AdditionalInformation scholarForm={scholarForm} />
                        <Separator />
                        <Beneficiary scholarForm={scholarForm} />
                        <Separator />
                        <Incentive scholarForm={scholarForm} />
                        <Separator />
                        <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5 ">
                            <Training
                                trainings={trainings}
                                setTrainings={setTrainings}
                            />
                            <Elegibility
                                eligibilities={eligibilities}
                                setEligibilities={setEligibilities}
                            />
                        </div>
                        <center>
                            <Button
                                disabled={loading}
                                className="mt-4 disabled:cursor-not-allowed"
                                variant={"warning"}
                            >
                                {loading ? (
                                    <Ring
                                        size="25"
                                        stroke="5"
                                        bgOpacity="0"
                                        speed="2"
                                        color="white"
                                    />
                                ) : (
                                    "Update"
                                )}
                            </Button>
                        </center>
                    </form>
                </Form>
            </Card>
        </>
    );
}
