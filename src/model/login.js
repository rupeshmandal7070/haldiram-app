import { MASTER_PROCESS_LIST } from "@/constants/data/processList";
import { find } from "lodash";

export function loginData(responseData) {
  return {
    token: responseData.access_token,
    displayName: responseData.user_details.first_name,
    fullName:
      responseData.user_details.first_name +
      " " +
      responseData.user_details.last_name +
      " (" +
      responseData.user_details.role +
      ")",
    userId: responseData.user_details.id,
    workDetails: {
      cities: responseData.cities.map((city) => {
        return {
          label: city.name,
          value: city.name,
          id: city.id,
          plants: city.plants.map((plant) => {
            return {
              label: plant.name,
              value: plant.name,
              id: plant.id,
            };
          }),
          shifts: responseData.shifts.map((shift) => {
            return {
              id: shift.id,
              label: shift.short_name + " (" + shift.duration + ")",
              value: shift.short_name + " (" + shift.duration + ")",
            };
          }),
          process: responseData.processes.map((process) => {
            const processObj = find(MASTER_PROCESS_LIST, { label: process });
            if (processObj) {
              return processObj;
            }
            return null;
          }),
        };
      }),
    },
  };
}
