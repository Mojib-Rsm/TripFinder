const Footer = () => {
  return (
    <footer className="py-6 px-6 md:px-12 mt-auto bg-card border-t">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TripFinder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
