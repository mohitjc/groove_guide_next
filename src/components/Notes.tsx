import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import Table from "./Table";
import { fire } from "@/components/Swal";
import { toast } from "react-toastify";
import datepipeModel from "@/utils/datepipemodel";
import FormControl from "@/components/FormControl";
import { loaderHtml } from "@/utils/shared";
import {  customizationList } from "@/utils/shared.utils";

const Notes = (({ boxId, order_id, email, userId, isDeleted = false }:any) => {
  const { get: getData, isLoading: loading } = ApiClientB();
  const [data, setData] = useState([]);
  const {post,deleteApi}=ApiClientB()
  const [filters, setFilter] = useState<any>({
    page: 1,
    count: 20,
    search: "",
    sortBy: "date desc",
  });
  const [form, setForm] = useState({ note: "",customization:[] });
  const [total, setTotal] = useState(0);

  const deleteNote = (id:any) => {
    if (isDeleted) {
      toast.error("This user is archived, you can't update this");
      return;
    }
    fire({
      title: "Do you want to delete this note?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result:any) => {
      if (result.isConfirmed) {
        loaderHtml(true);
        deleteApi("boxNotes/delete", { id: id }).then((res) => {
          loaderHtml(false);
          if (res.success) {
            filter()
            getDetails({page:1});
          }
        });
      }
    });
  };

  const columns = [
    {
      key: "date",
      name: "Date",
      render: (row:any) => {
        return (
          <span className="capitalize">{datepipeModel.datetime(row.date)}</span>
        );
      },
    },
    // {
    //   key: "addedByDetail",
    //   name: "Added By",
    //   render: (row) => (
    //     <span className="capitalize">
    //       {row?.noteByName || row?.addedByDetail?.fullName || "Unknown"}
    //     </span>
    //   ),
    // },
    {
      key: "note",
      name: "Note",
      className:'',
      render: (row:any) => (
        <>
          {row.userRequest?.customization?.length ? (
            <>
              <span className="">
                <div className="font-medium mb-2">
                  Customization : {row.userRequest?.customization?.toString()}
                </div>
                {row?.note}
              </span>
            </>
          ) : (
            <>
              <span className="">{row?.note}</span>
            </>
          )}
        </>
      ),
    },
    {
      key: "",
      name: "",
      render: (row:any) => (
        <>
          <span
            className="material-symbols-outlined cursor-pointer"
            onClick={() => deleteNote(row.id)}
          >
            delete
          </span>
        </>
      ),
    },
  ];

  const getDetails = (p={}) => {
    const params = {
      boxId,
      order_id,
      email,
      // userId,
      search: filters.search,
      page: filters.page,
      count: filters.count,
      sortBy: filters.sortBy,
      isUserNote: true,
      ...p
    };
    getData("boxNotes/listing", params).then((res) => {
      if (res.success) {
        setData(res.data || []);
        setTotal(res.total || 0);
      }
    });
  };

  useEffect(() => {
    getDetails();
  }, [filters.page, filters.count, filters.sortBy]);

  const filter = (p = {}) => {
    setFilter((prev:any) => ({ ...prev,page:1, ...p }));
  };

  const sorting = (key:any) => {
    let sorder = "asc";
    if (filters.key === key) {
      sorder = filters.sorder === "asc" ? "desc" : "asc";
    }
    const sortBy = `${key} ${sorder}`;
    filter({ sortBy, key, sorder });
  };

  const addMember = () => {
    if (isDeleted) {
      toast.error("This user is archived, you can't update this");
      return;
    }
    const payload:any = {
      boxId,
      order_id,
      email,
      userId,
      note: form.note,
      isUserNote: true,
    };

    if(form.customization.length){
      payload.userRequest={
        customization:form.customization
      }
    }

    loaderHtml(true);
    post("boxNotes/add", payload).then((res) => {
      loaderHtml(false);
      if (res.success) {
        getDetails();
        setForm({ note: "",customization:[] });
      }
    });
  };

  

  return (
    <>
      {order_id || boxId ? (
        <>
          <h3 className="mb-3"> Order ID: {order_id || boxId}</h3>
        </>
      ) : (
        <></>
      )}

      {loading ? (
        <>
          <div className="shine h-[40px] mb-1"></div>
          <div className="shine h-[40px] mb-1"></div>
          <div className="shine h-[40px] mb-1"></div>
          <div className="shine h-[40px] mb-1"></div>
          <div className="shine h-[40px] mb-1"></div>
          <div className="shine h-[40px] mb-1"></div>
        </>
      ) : (
        <>
          {total ? (
            <Table
                              className="mb-3"
                              data={data}
                              columns={columns}
                              page={filters.page}
                              count={filters.count}
                              //   sort={filters.sortBy}
                              total={total}
                              result={(e) => {
                                  if (e.event === "page") filter({ page: e.value });
                                  if (e.event === "sort") sorting(e.value);
                                  if (e.event === "count") filter({ count: e.value, page: 1 });
                                  if (e.event === "search") filter({ search: e.value, page: 1 });
                              } } nodata={undefined}            />
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMember();
            }}
          >
            <div className="">
              <div className="mb-3">
                <FormControl
                  type="multiselect"
                  placeholder="Customization"
                  value={form.customization}
                  onChange={(e:any) => {
                    setForm((prev) => ({ ...prev, customization: e }))
                  }}
                  options={customizationList}
                />
              </div>
              <div>
                <FormControl
                  label="Note"
                  type="textarea"
                  value={form.note}
                  onChange={(e:any) => setForm((prev) => ({ ...prev, note: e }))}
                  required
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2 items-center justify-end">
              
              <button className="inline-flex items-center gap-2 bg-primary px-6 py-2 rounded-lg text-white text-sm font-medium shadow hover:bg-opacity-90 transition-all">
                Submit
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
});

export default Notes;
