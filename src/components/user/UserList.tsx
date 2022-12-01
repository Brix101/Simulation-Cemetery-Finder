import { SearchUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import moment from "moment";
import React, { ChangeEvent, Suspense, useState } from "react";
import { Plus } from "react-feather";
import { useDebounce } from "usehooks-ts";
import { PrimaryButton } from "../buttons";
import { PrimaryInput } from "../inputs";
import LinearLoading from "../LinearLoading";

function UserList() {
  const [search, setSearch] = useState<SearchUserInput>({ name: "" });
  const debouncedValue = useDebounce<SearchUserInput>(search, 500);

  const { data, isLoading, isFetching } = trpc.user.getAll.useQuery(
    { ...debouncedValue },
    { enabled: true }
  );

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-light-blue/[.05] border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch({ name: event.target.value });
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-start gap-5 overflow-y-scroll  bg-white py-5">
      <div className="flex h-fit w-full justify-center">
        <div className="flex h-auto w-full max-w-6xl items-center justify-between">
          <div className="w-96">
            <PrimaryInput
              isSmall
              placeholder="Search a name"
              value={search?.name ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="w-28">
            <PrimaryButton isSmall>
              <span className="flex items-center gap-2">
                <Plus className="text-white" /> Add
              </span>
            </PrimaryButton>
          </div>
        </div>
        <div className="max-w-6xl">
          <LinearLoading isLoading={isLoading || isFetching} />
        </div>
      </div>
      <table className="w-full max-w-6xl text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-light-blue/[.10] text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Email
            </th>
            <th scope="col" className="py-3 px-6">
              contact No.
            </th>
            <th scope="col" className="py-3 px-6">
              birthdate
            </th>
            <th scope="col" className="py-3 px-6">
              Adress
            </th>
            <th scope="col" className="py-3 px-6">
              Type
            </th>
          </tr>
        </thead>
        <Suspense>
          <tbody>
            {data?.map((user, i) => {
              return (
                <tr key={i} className={`${TableStyle(i)}`}>
                  <th
                    scope="row"
                    className="cursor-pointer select-none whitespace-nowrap py-4 px-6 font-medium capitalize text-dark-blue-2 hover:text-dark-blue hover:underline "
                    onClick={() => {
                      //   setUserView(user);
                      //   setView("user");
                    }}
                  >
                    {user?.lastName +
                      ", " +
                      user?.firstName +
                      " " +
                      user?.middleName}
                  </th>

                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.contactNo}</td>
                  <td className="py-4 px-6">
                    {moment(user.birthDate).format("MMMM DD, YYYY")}
                  </td>
                  <td className="py-4 px-6">{user.address}</td>
                  <td className="py-4 px-6">{user.userType}</td>
                </tr>
              );
            })}
          </tbody>
        </Suspense>
      </table>
    </div>
  );
}

export default UserList;