import { Outlet } from "react-router";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router";

const { Sider, Content } = Layout;

const ProfileLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ background: "#fff", minHeight: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["info"]}
          onClick={({ key }) => navigate(`/profile/${key}`)}
          items={[
            { key: "", label: "Thông tin cá nhân" },
            { key: "change-password", label: "Đổi mật khẩu" },
            { key: "orders", label: "Lịch sử đơn hàng" },
            { key: "rewards", label: "Lịch sử nhận thưởng" },
            { key: "addresses", label: "Địa chỉ giao hàng" },
          ]}
        />
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfileLayout;
