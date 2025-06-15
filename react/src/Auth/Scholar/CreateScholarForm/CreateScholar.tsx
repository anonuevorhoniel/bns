import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UseLayout } from "@/Actions/LayoutAction";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScholarformSchema } from "../../../Validation/CreateScholarValidation";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import { ScholarStore } from "@/Actions/ScholarAction";
import { Toaster } from "sonner";
import Elegibility from "../ScholarForm/Eligibility";
import Incentive from "../ScholarForm/Incentive";
import Training from "../ScholarForm/Training";
import Beneficiary from "../ScholarForm/Beneficiary";
import AdditionalInformation from "../ScholarForm/AddtionalInfo/AdditionalInformation";
import Location from "../ScholarForm/Location";
import PersonalInformation from "../ScholarForm/PersonalInformation";
import { ScholarShow } from "../Show/ScholarShow";

export default function CreateScholars() {
    const { setItem, setBItem } = UseLayout();
    const [loading, setLoading] = useState(false);
    const { form, clearForm } = useCreateScholarForm();
    const { store } = ScholarStore();
    const [eligibilities, setEligibilities] = useState([]);
    const [trainings, setTrainings] = useState<any>([]);

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
    };

    const scholarForm = useForm<any>({
        resolver: zodResolver(ScholarformSchema),
        defaultValues: defaultValues,
    });
    const nav = useNavigate();

    const handleSubmit = () => {
        store(form, setLoading, nav, eligibilities, trainings);
    };

    useEffect(() => {
        setItem("Scholars");
        setBItem("Create");
        clearForm();
    }, []);

    return (
        <>
            <Toaster />
            <ScholarShow />
            <title>BNS | Create Scholar</title>
            <Link to={"/scholars"}>
                <Button variant={"primary"} className="text-xs h-8">
                    <CircleArrowLeft className="w-8" /> Back
                </Button>
            </Link>
            <Form {...scholarForm}>
                <form onSubmit={scholarForm.handleSubmit(handleSubmit)}>
                    <PersonalInformation scholarForm={scholarForm} />
                    <Location scholarForm={scholarForm} />
                    <AdditionalInformation />
                    <Beneficiary scholarForm={scholarForm} />
                    <Incentive scholarForm={scholarForm} />
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5">
                        <Training trainings={trainings} setTrainings={setTrainings} />
                        <Elegibility eligibilities={eligibilities} setEligibilities={setEligibilities} />
                    </div>
                    <center>
                        <Button
                            disabled={loading}
                            className="mt-4 disabled:cursor-not-allowed"
                            variant={"success"}
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
                                "Save"
                            )}
                        </Button>
                    </center>
                </form>
            </Form>
        </>
    );
}
