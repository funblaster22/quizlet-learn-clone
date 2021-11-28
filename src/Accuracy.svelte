<script>
    export let value = 0;
    let safeVal;
    $: safeVal = isNaN(value) ? 0 : value;

    // Adapted from https://stackoverflow.com/a/31851617
    function hsv_to_hsl(h, s, v) {
        // both hsv and hsl values are in [0, 1]
        let l = (2 - s) * v / 2;

        if (l !== 0) {
            if (l === 1) {
                s = 0;
            } else if (l < 0.5) {
                s = s * v / (l * 2);
            } else {
                s = s * v / (2 - l * 2);
            }
        }

        return [h, s, l];
    }

    /**
     * @param color1 {number[]} [h, s, v]
     * @param color2 {number[]} [h, s, v]
     * @param blendAmount {number} 0.0 - 1.0
     */
    function blendColors(color1, color2, blendAmount) {
        // Adapted from https://stackoverflow.com/a/32171077
        function mixChannel(index){
            const channelA = color1[index] * blendAmount;
            const channelB = color2[index] * (1 - blendAmount);
            return Math.floor(channelA + channelB);
        }

        return [mixChannel(0), mixChannel(1), mixChannel(2)];
    }

    /** Calculates a value's color on a green-yellow-red gradient from 0-100
     * @return {string} css color: hsl(r, g, b)
     */
    function calcColor(val) {
        let hsv;
        if (val >= 50)  // TODO: there probably is a branchless way to do this that I am too dumb to figure out
            hsv = blendColors([135.8, 47.9, 74.5], [50.2, 48.2, 100], (val - 50) / 50);
        else
            hsv = blendColors([50.2, 48.2, 100], [0, 57.7, 97.4], val / 50);
        const hsl = hsv_to_hsl(hsv[0], hsv[1] / 100, hsv[2] / 100);
        return `hsl(${hsl[0]}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
    }
</script>

<div style={"color:" + calcColor(safeVal)} title="Accuracy">
    {safeVal}%
</div>

<style>
    div {
        position: absolute;
        top: .5em;
        right: .5em;
        font-weight: bold;
    }
</style>