import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scholarResolver } from "@/app/Schema/ScholarSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PersonalInformationForm from "./PersonalInformationForm";
import LocationForm from "./LocationForm";
import AdditionalInformationForm from "./AdditionalInformationForm";
import BeneficiaryForm from "./BeneficiaryForm";
import FundForm from "./FundForm";
import TrainingForm from "./TrainingForm";
import EligibilityForm from "./EligibilitiesForm";

export default function ScholarForm({
    form,
    handleSubmit,
}: {
    form: UseFormReturn;
    handleSubmit: any;
}) {
    return (
        <>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5"
                >
                    <PersonalInformationForm form={form} />
                    <Separator />
                    <LocationForm form={form} />
                    <Separator />
                    <AdditionalInformationForm form={form} />
                    <Separator />
                    <BeneficiaryForm form={form} />
                    <Separator />
                    <FundForm form={form} />
                    <Separator />
                    <TrainingForm form={form} />
                    <Separator />
                    <EligibilityForm form={form} />
                    <div className="flex justify-center">
                        <Button>Submit</Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
