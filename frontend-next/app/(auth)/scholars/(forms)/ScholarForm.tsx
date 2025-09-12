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
import ButtonLoad from "@/components/custom/button-load";

export default function ScholarForm({
    form,
    handleSubmit,
    isPending
}: {
    form: UseFormReturn;
    handleSubmit: any;
    isPending: boolean
}) {
    return (
        <>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-5 relative"
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
                    <div className="flex justify-center sticky bottom-5">
                        <ButtonLoad label="Submit" className="w-full lg:max-w-xs" isPending={isPending}/>
                    </div>
                </form>
            </Form>
        </>
    );
}
