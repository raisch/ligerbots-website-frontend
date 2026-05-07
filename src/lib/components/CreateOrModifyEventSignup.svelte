<script>
  import { goto } from "$app/navigation";

    /**
     * Props
     */
    // /** @type {Record<string, any> | null} */
    /**
     * @type {{
     *   Subject: { mode?: 'editEvent'|'createEvent', collection?: string, item?: { id?: number|string, [key: string]: any } } | null,
     *   SetModifying: (subject: Record<string, any> | null, mode: string) => void,
     *   eventId?: string|number|undefined
     * }}
     */
    let { Subject, SetModifying } = $props();

    // initialize fields with safe defaults; $effect will populate when Subject arrives
    let fields = $state({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        status: ''
    })

    $effect(() => {
        if (!Subject) return;

        // If creating a new trip, provide sensible defaults
        const now = new Date();
        const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const defaultStartDate = today;
        const defaultEndDate = today;
        const defaultStatus = 'published';

        if (Subject.mode === 'createEvent') {
            fields.name = Subject?.item?.name || '';
            fields.description = Subject?.item?.description || '';
            fields.start_date = Subject?.item?.start_date || defaultStartDate;
            fields.end_date = Subject?.item?.end_date || defaultEndDate;
            fields.location = Subject?.item?.location || '';
            fields.status = Subject?.item?.status || defaultStatus;
        } else {
            fields.name = Subject?.item?.name || '';
            fields.description = Subject?.item?.description || '';
            fields.start_date = Subject?.item?.start_date || '';
            fields.end_date = Subject?.item?.end_date || '';
            fields.location = Subject?.item?.location || '';
            fields.status = Subject?.item?.status || '';
        }
    });

    async function handleSubmit() {
        if (!Subject) return

        /** @type {{ id?: number|string, destination?: string, departs_from?: string, departs_on?: string, departs_at?: string, arrives_at?: string, [key: string]: any }} */
        const itemPayload = { ...fields }
        if (Subject.mode === 'editEvent' && Subject.item && Subject.item.id) {
            itemPayload.id = Subject.item.id
        }

        const payload = {
            mode: Subject.mode || 'createEvent',
            item: itemPayload,
        }

        try {
            // TODO create this api endpoint
            const res = await fetch('/api/carpool/event', {
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

            if (Subject.mode === 'editEvent') {
                // // close modal and let parent refresh
                SetModifying && SetModifying(null, `editEvent`)
                location.reload()
                return
            }

            // close modal
            SetModifying && SetModifying(null, 'createEvent')
            // show event page
            goto(`/carpool/${result.create_event_item.id}`)
        } catch (err) {
            console.error(err)
            alert('Error saving')
        }
    }
    
</script>
<div style="border: none; height: 0; width: 0; margin: 0; padding: 0;">
   <div class="modifyBody">
        <h2 class="modifyHeading">{Subject ? `${Subject.mode === 'editEvent' ? 'Edit' : 'Create'} event ${fields.name}` : ''}</h2>
        <label>
            Name:
            <input bind:value={fields.name} type="text" placeholder="Enter name" />
        </label>
        <label>
            Description:
            <textarea class="modify-description" bind:value={fields.description} placeholder="Enter description"></textarea>
        </label>
        <label>
            Start Date:
            <input bind:value={fields.start_date} type="date" />
        </label>
        <label>
            End Date:
            <input bind:value={fields.end_date} type="date" />
        </label>
        <label>
            Location:
            <input bind:value={fields.location} type="text" placeholder="Enter location" />
        </label>
            

        <div style="margin-top:12px; display:flex; gap:8px;">
        <button onclick={handleSubmit}>{Subject?.mode === 'editEvent' ? 'Save' : 'Create'}</button>
        <button onclick={() => SetModifying(null, "createEvent")} type="button">Cancel</button>
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
        top: 120px;
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

    .modify-description {
        font-weight: normal;
        resize: vertical;
        width: 100%;
        min-height: 3em;
        max-height: 12em;
        line-height: 1.25em;
    }
    label {
        height: 2em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    input, select, textarea {
        width: 75%;
        height: 2em;
        padding: 2px;
        margin-top: 2px;
        float: right;
        /* box-sizing: border-box; */
    }
</style>