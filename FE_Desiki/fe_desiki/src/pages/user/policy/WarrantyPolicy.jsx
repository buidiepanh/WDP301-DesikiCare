import React from "react";
import "./WarrantyPolicy.css";
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
const WarrantyPolicy = () => {
  return (
    <div>
      <CategoryBar />

      <div className="warranty-container">
        <h1>Chính sách bảo hành sản phẩm Desiki</h1>

        <section>
          <h2>I. Chính sách bảo hành</h2>
          <h3>1. Điều kiện bảo hành</h3>
          <p>
            Để được bảo hành, khách hàng phải đến Yêu cầu bảo hành{" "}
            <strong>TẠI ĐÂY</strong> và gửi sản phẩm lại cho DeskiCare bằng
            cách:
          </p>
          <ul>
            <li>Điền thông tin để shipper DeskiCare đến lấy hàng</li>
            <li>
              Đem sản phẩm đến trực tiếp tại các cửa hàng của DeskiCare trên
              toàn quốc
            </li>
          </ul>
          <p>
            Cung cấp bằng chứng mua hàng được chấp nhận như Hóa đơn, đơn hàng,
            mã đặt hàng, các bằng chứng khác cho thấy bạn mua sản phẩm tại hệ
            thống cửa hàng chính thức của Hasaki.
          </p>

          <h3>2. Chính sách bảo hành</h3>
          <ul>
            <li>
              Bảo hành 1 đổi 1 nếu lỗi từ nhà sản xuất trong vòng 2 năm từ ngày
              mua
            </li>
            <li>
              Sản phẩm được sửa chữa hoặc thay thế miễn phí nếu phát sinh lỗi kỹ
              thuật từ nhà sản xuất
            </li>
            <li>Sau khi hết thời hạn bảo hành, Desiki không nhận sửa chữa</li>
          </ul>

          <h3>
            3. Desiki có quyền từ chối bảo hành đối với các trường hợp sau
          </h3>
          <ul>
            <li>Khách hàng không cung cấp được bằng chứng mua hàng</li>
            <li>Sản phẩm đã bị tháo rời hoặc sửa chữa không đúng kỹ thuật</li>
            <li>Lỗi do tác động bên ngoài như rơi vỡ, va đập, vào nước...</li>
            <li>
              Desiki sẽ không bảo hành nếu nhận được thông báo sau 48 giờ kể từ
              khi nhận hàng
            </li>
          </ul>

          <h3>4. Chính sách hỗ trợ khách hàng</h3>
          <p>
            Desiki có thể hỗ trợ dịch vụ sửa chữa tính phí nếu sản phẩm không
            còn đủ điều kiện bảo hành.
          </p>
        </section>

        <section>
          <h2>II. Kích hoạt bảo hành</h2>
          <ul>
            <li>Bảo hành 1 đổi 1 có hiệu lực trong 2 năm</li>
            <li>Sau khi nhận hàng, khách hàng đăng ký kích hoạt bảo hành</li>
            <li>
              Sử dụng mã QR trên hộp để kiểm tra thông tin hoặc qua email, Zalo
              xác nhận
            </li>
          </ul>
        </section>

        <section>
          <h2>III. Thủ tục bảo hành</h2>
          <h3>1. Khách hàng tạo phiếu yêu cầu bảo hành</h3>
          <p>
            Điền thông tin qua phiếu yêu cầu bảo hành trực tuyến. Bộ phận CSKH
            sẽ liên hệ trong vòng 1 giờ để tiếp nhận thông tin.
          </p>

          <h3>2. Xác nhận và gửi hàng</h3>
          <p>Khách hàng gửi sản phẩm về Desiki trong 3–5 ngày làm việc.</p>

          <h3>3. Phản hồi sau khi nhận sản phẩm</h3>
          <p>
            Ngay khi nhận sản phẩm, bộ phận kỹ thuật kiểm tra và phản hồi trong
            1 ngày làm việc.
          </p>

          <h3>4. Xử lý bảo hành</h3>
          <ul>
            <li>
              Nếu chấp nhận bảo hành: Gửi sản phẩm mới về trong 5–7 ngày làm
              việc
            </li>
            <li>
              Nếu từ chối bảo hành: Trả lại sản phẩm cũ trong vòng 5–7 ngày làm
              việc
            </li>
          </ul>
        </section>

        <section>
          <h2>IV. Tổng đài hỗ trợ</h2>
          <ul>
            <li>
              Số Hotline hỗ trợ chung: <strong>1800 6324</strong>
            </li>
            <li>
              Số Hotline hỗ trợ bảo hành: <strong>1800 8115</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
export default WarrantyPolicy;
