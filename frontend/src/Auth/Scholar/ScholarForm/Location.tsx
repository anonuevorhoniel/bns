import { UseAuth } from "@/Actions/AuthAction";
import {
    UseBarangay,
    UseCreateScholar,
    UseGetMunicipality,
} from "@/Actions/ScholarAction";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import FormFieldSelect from "@/Reusable/FormFieldSelect";
import { useEffect } from "react";

export default function Location({ scholarForm, scholarData }: any) {
    const { CreateScholarData, GetCreateScholarData } = UseCreateScholar();
    const { setFormData } = useCreateScholarForm();
    const { Barangays, GetBarangays } = UseBarangay();
    const { Municipalities, GetMunicipalities } = UseGetMunicipality();
    const { user } = UseAuth();

    useEffect(() => {
        GetCreateScholarData();
    }, []);

    useEffect(() => {
        GetMunicipalities(scholarData?.district_id);
        GetBarangays(scholarData?.citymuni_id);
    }, [scholarData?.district_id]);

    return (
        <div className="space-y-4 p-4">
            <p className="text-xl mb-6">
                Locations
            </p>
            <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:grid-cols-2">
                {!user?.assigned_district_id && (
                    <div>
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="district_id"
                            formLabel="District"
                            placeholder="--District--"
                            onChange={(e: any) => {
                                if (e != "" && e != null) {
                                    GetMunicipalities(e);
                                }
                            }}
                            selectItem={
                                <>
                                    {CreateScholarData?.districts &&
                                        Object.values(
                                            CreateScholarData?.districts
                                        ).map((d: any) => {
                                            return (
                                                <SelectItem
                                                    value={`${d.id}`}
                                                    key={d.id}
                                                >
                                                    {d.description}
                                                </SelectItem>
                                            );
                                        })}
                                </>
                            }
                        />
                    </div>
                )}

                {!user?.assigned_muni_code && (
                    <div>
                        <FormFieldSelect
                            scholarForm={scholarForm}
                            name="citymuni_id"
                            formLabel="Municipality"
                            placeholder="--Municipality--"
                            onChange={(e: any) => {
                                if (e != "" && e != null) {
                                    GetBarangays(e);
                                }
                            }}
                            // disabled={Municipalities?.length ? false : true}
                            selectItem={
                                <>
                                    {Municipalities &&
                                        Object.values(Municipalities).map(
                                            (d: any) => {
                                                return (
                                                    <SelectItem
                                                        value={`${d.code}`}
                                                        key={d.id}
                                                    >
                                                        {d.name}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                </>
                            }
                        />
                    </div>
                )}

                <div>
                    <FormFieldSelect
                        scholarForm={scholarForm}
                        name="barangay_id"
                        formLabel="Barangay"
                        placeholder="--Barangay--"
                        // disabled={Barangays?.length ? false : true}
                        selectItem={
                            <>
                                {Barangays &&
                                    Object.values(Barangays).map((d: any) => {
                                        return (
                                            <SelectItem
                                                value={`${d.code}`}
                                                key={d.id}
                                            >
                                                {d.name}
                                            </SelectItem>
                                        );
                                    })}
                            </>
                        }
                    />
                </div>
                <div>
                    <Label className="mb-2">Region</Label>
                    <Input
                        value="IV-A"
                        className="cursor-not-allowed"
                        disabled={true}
                        type="text"
                    />
                </div>
                <div>
                    <Label className="mb-2">Province</Label>
                    <Input disabled type="text" value="Laguna" />
                </div>
                <div className="col-span-2">
                    <FormField
                        control={scholarForm.control}
                        name={"complete_address"}
                        render={({ field }) => (
                            <>
                                <FormItem>
                                    <FormLabel>Complete Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="resize-none"
                                            placeholder={"--Complete Address--"}
                                            {...field}
                                            onInput={(e: any) => {
                                                setFormData({
                                                    name: "complete_address",
                                                    value: e.target.value,
                                                });
                                            }}
                                        ></Textarea>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
