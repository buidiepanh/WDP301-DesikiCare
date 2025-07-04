import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css";
import { Users, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { callAPIAdmin } from "../../api/axiosInstace";
import Swal from "sweetalert2";

// Custom Glassmorphism Components
const GlassChip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "success" | "error" | "default";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${getVariantStyles()}`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {label}
    </span>
  );
};

const GlassToggle = ({
  checked,
  onChange,
  checkedLabel = "Hoạt động",
  uncheckedLabel = "Bị khóa",
}: {
  checked: boolean;
  onChange: () => void;
  checkedLabel?: string;
  uncheckedLabel?: string;
}) => {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium backdrop-blur-sm transition-all duration-200 shadow-lg border ${
        checked
          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30"
          : "bg-red-500/20 border-red-400/40 text-red-100 hover:bg-red-500/30"
      }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {checked ? (
        <ToggleRight className="h-4 w-4" />
      ) : (
        <ToggleLeft className="h-4 w-4" />
      )}
      <span className="text-sm">{checked ? checkedLabel : uncheckedLabel}</span>
    </button>
  );
};

const RoleAccountManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    fetchRoles();
    fetchAccounts();
  }, []);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const res = await callAPIAdmin({
        method: "GET",
        url: "/api/Account/roles",
      });
      setRoles(res?.data?.roles || []);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách vai trò.", "error");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const res = await callAPIAdmin({
        method: "GET",
        url: "/api/Account/accounts",
      });
      setAccounts(res?.data?.accounts || []);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách tài khoản.", "error");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleToggle = async (accountId: string, isActive: boolean) => {
    try {
      await callAPIAdmin({
        method: "PUT",
        url: `/api/Account/accounts/${accountId}/deactivate/${
          isActive ? 0 : 1
        }`,
      });
      Swal.fire(
        "Thành công",
        `Đã ${isActive ? "vô hiệu hóa" : "kích hoạt"} tài khoản.`,
        "success"
      );
      fetchAccounts();
    } catch {
      Swal.fire("Lỗi", "Thao tác thất bại.", "error");
    }
  };

  const roleColumns = [
    {
      headerName: "ID",
      field: "_id",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
      width: 100,
    },
    {
      headerName: "Tên vai trò",
      field: "name",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <GlassChip label={params.value} variant="default" />
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
      flex: 1,
    },
  ];

  const accountColumns = [
    {
      headerName: "Họ tên",
      field: "fullName",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.95)",
        background: "transparent !important",
        fontWeight: "500",
      },
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
      flex: 1,
    },
    {
      headerName: "Vai trò",
      field: "roleId",
      cellRenderer: (params: any) => {
        const roleName =
          roles.find((r) => r._id === params.value)?.name || "Không xác định";
        const variant =
          roleName === "Admin"
            ? "error"
            : roleName === "Manager"
            ? "success"
            : "default";
        return (
          <div className="flex items-center h-full">
            <GlassChip label={roleName} variant={variant} />
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
      width: 150,
    },
    {
      headerName: "Trạng thái",
      field: "isDeactivated",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <GlassToggle
            checked={!params.value}
            onChange={() => handleToggle(params.data._id, !params.value)}
            checkedLabel="Hoạt động"
            uncheckedLabel="Bị khóa"
          />
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
      width: 150,
    },
  ];

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">
          Quản lý Vai trò & Tài khoản
        </h1>
        <p className="text-white/70 text-lg">
          Quản lý vai trò và tài khoản người dùng trong hệ thống.
        </p>
      </div>

      {/* Roles Section */}
      <div className="mb-8">
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
          <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Danh sách vai trò
          </h2>
          <p className="text-white/70">Các vai trò có trong hệ thống.</p>
        </div>

        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
          {isLoadingRoles ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white/80">Đang tải dữ liệu vai trò...</div>
            </div>
          ) : (
            <div
              className="ag-theme-alpine w-full"
              style={
                {
                  height: "200px",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={roles}
                columnDefs={roleColumns}
                domLayout="autoHeight"
                rowHeight={50}
                animateRows={true}
                suppressPaginationPanel={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Accounts Section */}
      <div>
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
          <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách tài khoản
          </h2>
          <p className="text-white/70">
            Quản lý trạng thái hoạt động của các tài khoản.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
          {isLoadingAccounts ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white/80">Đang tải dữ liệu tài khoản...</div>
            </div>
          ) : (
            <div
              className="ag-theme-alpine w-full"
              style={
                {
                  height: "500px",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={accounts}
                columnDefs={accountColumns}
                pagination={true}
                paginationPageSize={6}
                rowHeight={60}
                animateRows={true}
                domLayout="normal"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleAccountManagement;
