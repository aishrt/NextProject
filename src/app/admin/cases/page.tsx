import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import CaseTable from "./CaseTable";
import Case from "@/models/case.model";
import db from "@/utils/connectDB";

export const metadata: Metadata = {
  title: "Cases",
  description: "Generated by create next app",
};



export default async function Categories({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let page: string | string[] | undefined | number = searchParams?.page;
  // const router = useRouter();
  let id: string | string[] | undefined | number = searchParams?.id;

  page = !!page ? +page : 1;
  const fetchData = async (
      pageNumber: number
  ): Promise<any> => {
      await db.connectDB();
      const totalUsers = await Case.countDocuments({});
      const totalPages = Math.ceil(totalUsers / 10);
      if (pageNumber > totalPages) {
          pageNumber = totalPages;
      }
      const start = pageNumber - 1;
      const userData = await Case.find({})
          .limit(10)
          .skip(start * 10)
      return {
          data: userData,
          currentPage: pageNumber,
          totalEntries: totalUsers,
      };
  };

  const Listdata: any = await fetchData(page);

  return (
    <ContentWrapper>
      <div className="top-title">
        <h2 className="f-22 bold">Cases</h2>
      </div>
      <CaseTable />
    </ContentWrapper>
  );
}