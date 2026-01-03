<script>
    /**
     * Props
     */
    // /** @type {Record<string, any> | null} */
    /**
     * @type {{
     *   Subject: { mode?: 'edit'|'create', collection?: string, item?: { id?: number|string, [key: string]: any } } | null,
     *   SetModifying: (subject: Record<string, any> | null, mode: string) => void,
     *   eventId: string|number|undefined
     * }}
     */
    let { Subject, SetModifying, eventId } = $props();

    // initialize fields with safe defaults; $effect will populate when Subject arrives
    let fields = $state({
        destination: '',
        departs_from: '',
        departs_on: '',
        departs_at: '',
        arrives_at: ''
    })

    $effect(() => {
        if (!Subject) return;

        // If creating a new trip, provide sensible defaults
        const now = new Date();
        const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const defaultDepartTime = '09:00';
        const defaultArriveTime = '10:00';

        if (Subject.mode === 'create') {
            fields.destination = Subject?.item?.destination || '';
            fields.departs_from = Subject?.item?.departs_from || '';
            fields.departs_on = Subject?.item?.departs_on || today;
            fields.departs_at = Subject?.item?.departs_at || defaultDepartTime;
            fields.arrives_at = Subject?.item?.arrives_at || defaultArriveTime;
        } else {
            fields.destination = Subject?.item?.destination || '';
            fields.departs_from = Subject?.item?.departs_from || '';
            fields.departs_on = Subject?.item?.departs_on || '';
            fields.departs_at = Subject?.item?.departs_at || '';
            fields.arrives_at = Subject?.item?.arrives_at || '';
        }
    });

    async function handleSubmit() {
        if (!Subject) return

        /** @type {{ id?: number|string, destination?: string, departs_from?: string, departs_on?: string, departs_at?: string, arrives_at?: string, [key: string]: any }} */
        const itemPayload = { ...fields }
        if (Subject.mode === 'edit' && Subject.item && Subject.item.id) {
            itemPayload.id = Subject.item.id
        }

        const payload = {
            mode: Subject.mode || 'create',
            collection: Subject.collection,
            item: itemPayload,
            eventId
        }

        try {
            const res = await fetch('/api/carpool/trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()
            if (!res.ok) {
                const err = result?.error ?? result
                const message = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err)
                alert(message || 'Failed to save')
                return
            }

            // close modal and let parent refresh
            SetModifying && SetModifying(null, "create")
            // simple refresh of page to show changes
            location.reload()
        } catch (err) {
            console.error(err)
            alert('Error saving')
        }
    }
    
</script>
<div style="border: none; height: 0; width: 0; margin: 0; padding: 0;">
   <div class="modifyBody">
         <h2 class="modifyHeading">{Subject ? `${Subject.mode === 'edit' ? 'Edit' : 'Create'} ${Subject.collection?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : ''}</h2>
         {#if Subject?.collection == "destination_trip" || Subject?.collection == 'return_trip'}
            <label>
                Destination:
                <input bind:value={fields.destination} type="text" placeholder="Enter destination" />
            </label>
            <label>
                Departs From:
                <input bind:value={fields.departs_from} type="text" placeholder="Enter departure location" />
            </label>
            <label>
                Departs On:
                <input bind:value={fields.departs_on} type="date" />
            </label>
            <label>
                Departs At:
                <input bind:value={fields.departs_at} type="time" />
            </label>
            <label>
                Arrives At:
                <input bind:value={fields.arrives_at} type="time" />
            </label>

         {/if}

         <div style="margin-top:12px; display:flex; gap:8px;">
            <button on:click={handleSubmit}>{Subject?.mode === 'edit' ? 'Save' : 'Create'}</button>
            <button on:click={() => SetModifying(null, "create")} type="button">Cancel</button>
         </div>
   </div>
</div>
<style>
    .modifyHeading {
        margin-top: 0;
    }
    .modifyBody {
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        position: absolute;
        width: 500px;
        height: auto;
        top: calc(50% - 100px);
        left: calc(50% - 250px);
        z-index: 5;
        /* transform: translate(50%, 50%); */
    }
    div {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #f9f9f9;
        display: flex;
        flex-wrap: wrap;
    }
    span {
        flex: 0 0 50%;
    }
</style>