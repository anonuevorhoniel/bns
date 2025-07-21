import { UseSignatoryIndex } from "@/Actions/SignatoriesAction";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import DialogDrawer from "@/Reusable/DialogDrawer";
import { useForm } from "react-hook-form";
import { CreateSignatorySchema } from "./Schema/CreateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PenLine } from "lucide-react";
import { useEffect } from "react";
import ButtonLoad from "@/Reusable/ButtonLoad";

export default function EditSignatories() {
    const {
        openEdit,
        setOpenEdit,
        designations,
        setEditForm,
        editSignatory,
        updateButtonLoad,
        setAllDataEditForm,
        updateSignatory,
    } = UseSignatoryIndex();

    const defaultValues = {
        name: editSignatory?.name ?? "",
        description: editSignatory?.description ?? "",
        designation_id: editSignatory?.designation_id ?? "",
        status: editSignatory?.status ?? "",
    };

    const signatoryForm = useForm<any>({
        resolver: zodResolver(CreateSignatorySchema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        let edit_data = {
            name: editSignatory?.name ?? "",
            description: editSignatory?.description ?? "",
            designation_id: editSignatory?.designation_id ?? "",
            status: editSignatory?.status ?? "",
        };
        signatoryForm.reset(edit_data);
        setAllDataEditForm(edit_data);
    }, [editSignatory]);

    const handleSubmit = () => {
       updateSignatory();
    };

    const content = (
        <div className="p-6 pb-0">
            <Label className="text-lg mb-5">
                <div className="text-yellow-500">
                    <PenLine />
                </div>{" "}
                Edit Signatories
            </Label>

            <Form {...signatoryForm}>
                <form
                    onSubmit={signatoryForm.handleSubmit(handleSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        name="name"
                        control={signatoryForm.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value}
                                            onInput={(e) =>
                                                setEditForm({
                                                    name: "name",
                                                    value: (
                                                        e.target as HTMLInputElement
                                                    ).value,
                                                })
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    ></FormField>

                    <FormField
                        name="description"
                        control={signatoryForm.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value}
                                            onInput={(e) =>
                                                setEditForm({
                                                    name: "description",
                                                    value: (
                                                        e.target as HTMLInputElement
                                                    ).value,
                                                })
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    ></FormField>

                    <FormField
                        name="designation_id"
                        control={signatoryForm.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Designation</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                                setEditForm({
                                                    name: "designation_id",
                                                    value: e,
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-full" value={field.value}>
                                                <SelectValue placeholder="-- Select Designation --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {designations?.map(
                                                        (d: any) => {
                                                            return (
                                                                <SelectItem
                                                                    key={d.id}
                                                                    value={d.id}
                                                                >
                                                                    {
                                                                        d.designation
                                                                    }
                                                                </SelectItem>
                                                            );
                                                        }
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    ></FormField>

                    <FormField
                        name="status"
                        control={signatoryForm.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                                setEditForm({
                                                    name: "status",
                                                    value: e,
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="-- Select Status --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem
                                                        key={1}
                                                        value={"1"}
                                                    >
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem
                                                        key={2}
                                                        value={"0"}
                                                    >
                                                        Inactive
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    ></FormField>

                    <div className="flex justify-center">
                       <ButtonLoad loading={updateButtonLoad} variant="success" name="Submit"/>
                    </div>
                </form>
            </Form>
        </div>
    );
    return (
        <>
            <DialogDrawer
                content={content}
                open={openEdit}
                setOpen={setOpenEdit}
                size={"p-0"}
            />
        </>
    );
}
