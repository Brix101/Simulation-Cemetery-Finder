import { UpdateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { UserType } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Trash2, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { PrimaryButton, SecondaryButton } from "../buttons";
import DistructiveButton from "../buttons/DestructiveButton";
import { PasswordInput, PrimaryInput } from "../inputs";
import useUserStore from "./userStore";

function UpdateUserDialog() {
  const { data: sessionData } = useSession();
  const ref = useRef(null);
  const { isUserUpdate, setIsUserUpdate, setUsers, users } = useUserStore();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdateUserInput>({ mode: "onChange" });

  const { mutate, isLoading } = trpc.user.updateUser.useMutation({
    onSuccess: (user) => {
      setUsers(
        users.map((userData) => {
          if (userData.id === user.id) {
            return user;
          } else {
            return userData;
          }
        })
      );
      handleCloseButton();
    },
  });

  const { mutate: deleteMutation } = trpc.user.deleteUser.useMutation({
    onMutate: () => {
      setUsers(users.filter((user) => user.id !== isUserUpdate?.id));
      handleCloseButton();
    },
  });

  const userType = (Object.keys(UserType) as (keyof typeof UserType)[]).map(
    (enumKey) => {
      return {
        label: UserType[enumKey].toLowerCase(),
        value: UserType[enumKey],
      };
    }
  );
  const handleCloseButton = () => {
    reset();
    setIsUserUpdate(undefined);
  };
  useEffect(() => {
    if (isUserUpdate) {
      reset({
        id: isUserUpdate.id,
        address: isUserUpdate.address as string,
        birthDate: isUserUpdate.birthDate as Date,
        contactNo: isUserUpdate.contactNo as string,
        email: isUserUpdate.email as string,
        firstName: isUserUpdate.firstName as string,
        lastName: isUserUpdate.lastName as string,
        middleName: isUserUpdate.lastName as string,
        userType: isUserUpdate.userType,
      });
    }
  }, [isUserUpdate, reset]);

  function onSubmit(values: UpdateUserInput) {
    mutate({ ...values });
  }

  if (!isUserUpdate) {
    return <></>;
  }
  const isAdmin = sessionData?.user?.role === "Admin";

  return (
    <div className="absolute top-0 left-0 z-max flex h-full w-full select-none items-center justify-center bg-black/[.20] shadow-lg drop-shadow-lg">
      <div
        ref={ref}
        className="mx-5 flex gap-2 transition delay-150 ease-in-out"
      >
        <div className="relative flex h-fit w-full max-w-3xl flex-col justify-between gap-10 overflow-hidden rounded-lg bg-white p-5">
          <div className="absolute right-1 top-1 h-10 w-10">
            <SecondaryButton isSmall onClick={handleCloseButton}>
              <X className="text-dark-blue" />
            </SecondaryButton>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex h-full w-full flex-col justify-between pb-10"
          >
            <h1 className="text-2xl font-bold text-dark-blue">
              {isAdmin ? "Update user" : "User Information"}{" "}
            </h1>
            <div className="space-y-2 pt-10">
              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    First Name
                  </label>
                  <PrimaryInput
                    isSmall
                    placeholder="First Name"
                    register={register("firstName")}
                    disabled={!isAdmin}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Middle Name
                  </label>
                  <PrimaryInput
                    isSmall
                    placeholder="Middle Name"
                    register={register("middleName")}
                    disabled={!isAdmin}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Last Name
                  </label>
                  <PrimaryInput
                    isSmall
                    placeholder="Last Name"
                    register={register("lastName")}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="flex w-full gap-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Contact No
                  </label>
                  <PrimaryInput
                    isSmall
                    placeholder="Contact No"
                    register={register("contactNo")}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Birthdate
                  </label>
                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                      <DatePicker
                        className="h-10 w-full rounded-lg border-2 border-light-blue bg-white px-4 font-sans text-base text-gray-900 outline-none placeholder-shown:border-gray-400 hover:border-light-blue
                focus:border-light-blue disabled:border-gray-200"
                        placeholderText="Select date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat="MMMM-dd-yyyy"
                        required
                        disabled={!isAdmin}
                      />
                    )}
                  />
                </div>
                {isAdmin ? (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      User type
                    </label>
                    <Controller
                      control={control}
                      defaultValue={UserType["User" as keyof typeof UserType]}
                      name="userType"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          classNamePrefix="addl-class"
                          options={userType}
                          value={userType.find((c) => c.value === value)}
                          onChange={(role) => {
                            onChange(role?.value);
                          }}
                          isDisabled={!isAdmin}
                        />
                      )}
                    />
                  </div>
                ) : null}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Address
                </label>
                <PrimaryInput
                  isSmall
                  placeholder="Address"
                  register={register("address")}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex w-full gap-2 pt-5">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Email
                  </label>
                  <PrimaryInput
                    isSmall
                    placeholder="Email"
                    register={register("email")}
                    disabled={!isAdmin}
                  />
                </div>
                {isAdmin ? (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Password
                    </label>
                    <PasswordInput
                      isSmall
                      placeholder="Password"
                      register={register("password")}
                      disabled={!isAdmin}
                    />
                  </div>
                ) : null}
              </div>
              {isAdmin ? (
                <div className="flex items-end justify-between">
                  <div>
                    {sessionData?.user?.role === "Admin" ? (
                      <DistructiveButton
                        type="button"
                        isSmall
                        onClick={() => deleteMutation({ id: isUserUpdate.id })}
                      >
                        <Trash2 />
                      </DistructiveButton>
                    ) : null}
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <div className="w-20">
                      <SecondaryButton
                        type="button"
                        isSmall
                        onClick={handleCloseButton}
                      >
                        Cancel
                      </SecondaryButton>
                    </div>
                    <div className="w-44">
                      <PrimaryButton
                        isSmall
                        disabled={!isDirty || isLoading}
                        isLoading={isLoading}
                      >
                        Update
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserDialog;
