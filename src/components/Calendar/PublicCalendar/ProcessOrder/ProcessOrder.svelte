<script>
	let order = null;
	let error = null;
	let message = '';
	let Email = '';
	let id = '';
	let name = '';
	let time = '';
	let Location = '';
	let orderId = '';
	import Cookies from 'js-cookie';

	import successIcon from '../../../../assets/images/success-icon.png';

	async function getOrder() {
		const response = await fetch(`http://localhost:8080/api/public/getOrder/${orderId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			order = await response.json();

			Email = order.order.email;
			id = order.order.uuid;
			name = order.order.firstName + ' ' + order.order.lastName;
			time = order.event.doorsOpenTime;
			location = order.event.location;
		} else {
			error = 'failure';
		}
	}

	function checkOrderId() {
		orderId = Cookies.get('checkout-cartid');
		if (orderId && orderId !== '') {
			clearInterval(interval);
			getOrder();
		}
	}

	let interval = setInterval(checkOrderId, 1000);
</script>

<div class="flex flex-col items-center gap-6 p-5">
	<div class="bg-[#FFF] gap-4 max-w-md w-full text-center">
		<div>
			<div class="flex justify-center mb-6">
				<img src={successIcon} alt="successIcon " />
			</div>

			<h1 class="text-[16px] font-[500] leading-6 text-[#0D1526]">Thanks for your order!</h1>

			<p class="text-[14px] font-[400] leading-[21px] text-[#666C79] mt-2 text-balance">
				Your tickets are sent to: <br />
				<span class="text-[14px] font-[500] leading-[21px] text-[#0D1526]">{Email}</span>
			</p>
		</div>
	</div>
	<div class="flex flex-col bg-[#F9FAFB] rounded-lg gap-4 py-3 px-4">
		<p class="text-[14px] font-[400] leading-[21px] text-[#666C79] mt-2 text-balance">
			Order ID <br />
			<span class="text-[14px] font-[500] leading-[21px] text-[#0D1526]">{id}</span>
		</p>
		<p class="text-[14px] font-[400] leading-[21px] text-[#666C79] mt-2 text-balance">
			Show name <br />
			<span class="text-[14px] font-[500] leading-[21px] text-[#0D1526]">{name}</span>
		</p>
		<p class="text-[14px] font-[400] leading-[21px] text-[#666C79] mt-2 text-balance">
			Date & time <br />
			<span class="text-[14px] font-[500] leading-[21px] text-[#0D1526]">{time}</span>
		</p>
		<p class="text-[14px] font-[400] leading-[21px] text-[#666C79] mt-2 text-balance">
			Location <br />
			<span class="text-[14px] font-[500] leading-[21px] text-[#0D1526]">{Location}</span>
		</p>
	</div>
	<div class="flex justify-start bg-[#FFF]">
		<h2 class=" flex justify-start al text-[16px] font-[500] leading-6 text-[#0D1526]">
			Check out other shows!
		</h2>
	</div>
</div>
