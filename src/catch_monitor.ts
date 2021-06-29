import qms from "./qms";

function catchMonitor(msg: string, point: number) {
    qms({
        dataType: 'catchMonitor',
        data: {
            msg,
            point,
        },
    });
}


export default catchMonitor;
