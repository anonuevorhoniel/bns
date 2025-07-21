export default function ScholarValueSet({ scholarData, defaultValues }: any) {
    //scholarData yung galing sa backend, imamatch sa default values, para mamodify gamit yung new variable obj
    let obj: any = {};

    for (const key in defaultValues) {
        let data_val = scholarData?.[key];

        if (key == "place_of_assignment") {
            let poa = "";
            let data_poa = scholarData?.place_of_assignment;

            switch (data_poa) {
                case "BNS Coordinator":
                    poa = "BNS Coordinator";
                    break;
                case null:
                    poa = "";
                    break;
                default:
                    poa = "Same as Barangay";
                    break;
            }
            obj[key] = poa;
            
        } else if (key == "sex") {
            let sex = "";
            let sex_data = scholarData?.sex;

            switch (sex_data) {
                case "F":
                    sex = "Female";
                    break;
                case "f":
                    sex = "Female";
                    break;
                case "Female":
                    sex = "Female";
                    break;
                case "Male":
                    sex = "Male";
                    break;
                case "M":
                    sex = "Male";
                    break;
                case "m":
                    sex = "Male";
                    break;
            }
            obj[key] = sex;
        } else {
            obj[key] = data_val ?? "";
        }
    }

    return obj;
}
