"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { axios } from "@/utils/axios";
function CalenderView({ data, id, userRole, status }: any) {
  const [ListData, setListData] = useState(data?.data);
  const router = useRouter();

  const [filter, setFilter] = useState({
    currentPage: "",
    totalEntries: "",
    status: status || "",
    currentFilter: false,
  });
  const [toolTip, settooltip] = useState("");
  useEffect(() => {
    let filterData = localStorage.getItem("task_filter");
    setFilter({ ...filter, status: filterData });
  }, []);
  const GetTask = (p: any) => {
    setFilter({ ...filter, currentFilter: true });
    axios
      .get(
        `/api/task/list?id=${id || ""}&role=${userRole}&status=${
          p?.status || "pending"
        }`
      )
      .then((res: any) => {
        if (res.status == 200) {
          const result: any = res?.data?.map((itm: any, i: any) => {
            return { ...itm, serial: i + 1 };
          });
          setListData(result);
          setFilter({
            ...filter,
            currentPage: res?.currentPage,
            totalEntries: res?.totalEntries,
          });
        }
      });
  };

  console.log(status, "status", localStorage.getItem("task_filter"));
  useEffect(() => {
    // GetTask();

    const UpdatedData: any = ListData?.map((itm: any, i: any) => {
      return { ...itm, serial: i + 1 };
    });
    if (!filter?.currentFilter) {
      setListData(UpdatedData);
      setFilter({
        ...filter,
        currentPage: data?.currentPage,
        totalEntries: data?.totalEntries,
      });
    }
  }, []);

  const GetUpdateButton = (key: any) => {
    if (key == "pending") {
      return true;
    }
    if (key == "inProgress") {
      return true;
    }
    if (key == "edit_suggesstion") {
      return true;
    }
  };
  const events = ListData?.map((itm: any) => {
    return {
      title: itm?.title,
      start: new Date(itm?.submissionAt),
      groupId: itm?._id,
    };
  });
  const eventsData = [{ title: "Meeting", start: new Date() }];
  const renderEventContent = (eventInfo: any, i: any) => {
    return (
      <>
        <b
          onMouseDown={() => {
            console.log(ListData[i]);
            settooltip(ListData[i]?.description);
          }}
          //  style={{ backgroundColor: "red", color: "white", padding: "2px" }}
        >
          {eventInfo?.timeText}
        </b>
        <i
        // style={{ backgroundColor: "red", color: "white", padding: "2px" }}
        >
          {eventInfo?.event.title}
        </i>
      </>
    );
  };
  return (
    <div>
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="col-12 col-md-3">
              <div className="filter-input">
                <select
                  className="form-control filter-ip"
                  name="status"
                  value={filter?.status}
                  onChange={(e: any) => {
                    GetTask({ status: e.target.value });
                    setFilter({ ...filter, status: e.target.value });
                    localStorage.setItem("task_filter", e.target.value);
                    if (id) {
                      return router.push(
                        `/${userRole}/tasks?id=${id}&status=${e.target.value}`
                      );
                    }
                    router.push(`/${userRole}/tasks?status=${e.target.value}`);
                  }}
                >
                  <option value={""}>All</option>

                  <option value={"inProgress"}>in Progress</option>
                  <option value={"approved"}>Approved</option>
                  <option value={"reviewing"}>Reviewing</option>

                  <option value={"edit_suggesstion"}>Edit Suggesstion</option>

                  <option value={"reject"}>Rejected</option>

                  <option value={"pending"}>Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {data?.data && (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventClick={(e) => {
            router.push(`${userRole}/tasks`);
          }}
          eventContent={renderEventContent}
        />
      )}
    </div>
  );
}

export default CalenderView;
