const Footer = () => {
  <footer className="border-t mt-auto py-8">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">ZEVENT</span>
      </div>
      <div className="text-sm text-muted-foreground">
        © 2025 ZEVENT. All rights reserved.
      </div>
      <div className="flex gap-4">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Contact
        </a>
      </div>
    </div>
  </footer>;
};
export default Footer;