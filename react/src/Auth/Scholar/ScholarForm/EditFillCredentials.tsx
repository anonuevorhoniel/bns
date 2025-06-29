import { useCreateScholarForm } from "@/forms/CreateScholarForm";
import { useEffect } from "react";

export default function EditFrillCredentials({scholarData}: any) {

const { setFormData } = useCreateScholarForm();
       useEffect(() => {
        setFormData({
            name: "first_name",
            value: scholarData?.first_name,
        });
        setFormData({
            name: "middle_name",
            value: scholarData?.middle_name,
        });
        setFormData({
            name: "last_name",
            value: scholarData?.last_name,
        });
         setFormData({
            name: "name_extension",
            value: scholarData?.name_extension,
        });
         setFormData({
            name: "name_on_id",
            value: scholarData?.name_on_id,
        });
        setFormData({
            name: "sex",
            value: scholarData?.sex,
        });
    }, [scholarData]);
}