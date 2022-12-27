// index.tsx
import { MyWidget } from "../src/components/exampleWidget";
import { mountComponent } from "../src/utils/mount";

mountComponent({
    dataName: "data-example",
    formatData(data) {
        if (!data.exampleMyData) {
            throw new Error("You must specify the [data-example-my-data] attribute for this widget to load");
        }
        return { ...data, myData: data.exampleMyData };
    },
    component: MyWidget,
});