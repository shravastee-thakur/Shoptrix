import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <LocalShippingOutlinedIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold md:text-base">
                Free Shipping
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                On orders above Rs 500
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <GppGoodOutlinedIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold md:text-base">
                Secure Payment
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                100% secure transactions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <HeadsetMicOutlinedIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold md:text-base">
                24/7 support
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
