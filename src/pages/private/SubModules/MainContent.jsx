import { useState, lazy, Suspense } from "react";

import { TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import Tab from "../../../components/TabPane/Tab";
import TabList from "../../../components/TabPane/TabList";
import Spinner from "../../../components/Spinner";

const Categories = lazy(() => import("./Categories/List"));
const Brands = lazy(() => import("./Brands/List"));
const Variants = lazy(() => import("./Variants/List"));

const MainContent = () => {
  const [module, setModule] = useState({
    categories: true,
    brands: false,
    variants: false,
  });

  const { categories, brands, variants } = module;

  return (
    <>
      {/* Tab Pane */}
      <Tabs variant="unstyled">
        <TabList>
          <Tab
            onClick={() =>
              setModule({
                categories: true,
                brands: false,
                variants: false,
              })
            }
          >
            Categorías
          </Tab>
          <Tab
            onClick={() =>
              setModule({
                categories: false,
                brands: true,
                variants: false,
              })
            }
          >
            Marcas
          </Tab>
          <Tab
            onClick={() =>
              setModule({
                categories: false,
                brands: false,
                variants: true,
              })
            }
          >
            Variaciones
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {categories && (
              <Suspense fallback={<Spinner />}>
                <Categories />
              </Suspense>
            )}
          </TabPanel>
          <TabPanel>
            {brands && (
              <Suspense fallback={<Spinner />}>
                <Brands />
              </Suspense>
            )}
          </TabPanel>
          <TabPanel>
            {variants && (
              <Suspense fallback={<Spinner />}>
                <Variants />
              </Suspense>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MainContent;
